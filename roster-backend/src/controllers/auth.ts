import { Request, Response } from "express";
import { UserModel, createUser, getUserByEmail } from "../db/users";
import { generateToken, generateRefreshToken, verifyToken } from "../helpers/generateJWT";
import { random, authentication } from "../helpers/encryptedPassword";

export interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const login = async (req: Request, res: Response): Promise<void> => {
    console.log('@@ Login called');
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log("Found User:", user.email);

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            res.status(403).json({ message: "Invalid credentials" });
            return;
        }

        const accessToken = generateToken(user._id.toString(), user.roleType.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        user.authentication.sessionToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });
        console.log("Cookies on request:", req.cookies);

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    console.log('@@ refreshToken called');

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token required" });
        return;
    }

    try {
        const decoded = verifyToken(refreshToken, true);  // Ensure second param is 'true' for refresh token
        if (!decoded || !decoded.id) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        const user = await UserModel.findById(decoded.id);
        if (!user || user.authentication.sessionToken !== refreshToken) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        const newAccessToken = generateToken(user._id.toString(), user.roleType.toString());

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", { path: '/' });
    res.status(200).json({ message: "Logged out successfully" });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    console.log('@@ Register called');
    try {
        console.log("@@@ Incoming request body:", req.body);
        console.log("@@@ Incoming request file:", req.file ? req.file.originalname : "No file uploaded");

        const { name, email, password, phoneNumber, address, DOB, nationality, roleType, visaExpiryDate, idNumber } = req.body;

        const requiredFields = ['name', 'email', 'password', 'phoneNumber', 'address', 'DOB', 'nationality', 'roleType', 'idNumber'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            res.status(400).json({ message: "Missing required information", missingFields });
            return;
        }

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { idNumber }]
        });
        if (existingUser) {
            res.status(400).json({
                message: existingUser.email === email ? "Email already exists" : "ID Number already exists"
            });
            return;
        }

        const salt = random();
        const newUser = await createUser({
            name,
            email,
            phoneNumber,
            address,
            DOB: new Date(DOB),
            nationality,
            visaExpiryDate: visaExpiryDate ? new Date(visaExpiryDate) : undefined,
            idNumber,
            roleType,
            profileImage: (req as MulterRequest).file ? {
                data: (req as MulterRequest).file!.buffer,
                contentType: (req as MulterRequest).file!.mimetype
            } : null,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        console.log("@@@ User created successfully:", newUser);

        res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("@@@ Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
