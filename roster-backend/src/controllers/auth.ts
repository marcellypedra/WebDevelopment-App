import express from "express";
import { UserModel, AuthModel, createUser, getUserByEmail } from "../db/users";
import { generateToken, generateRefreshToken, verifyToken } from "../helpers/generateJWT";
import { random, authentication } from "../helpers/encryptedPassword";

export const login = async (req: express.Request, res: express.Response) => {
    console.log('@@ Login called');
    try {
        const { email, password } = req.body;
        if (!email || !password){             
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await getUserByEmail(email);
        if (!user) { 
            return res.status(404).json({ message: "User not found" }); 
        }
        console.log("Found User:", user.email);        

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.status(403).json({ message: "Invalid credentials" });
        }

        // Generate access and refresh tokens
        const accessToken = generateToken(user._id.toString(), user.roleType.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        // Find or create the auth record for the user
        let authRecord = await AuthModel.findOne({ userId: user._id });

        if (!authRecord) {
        // Create new AuthModel if one doesnt exist yet
            authRecord = new AuthModel({
                userId: user._id,
                password: user.authentication.password,
                salt: user.authentication.salt,
                sessionToken: refreshToken,
            });
        } else { authRecord.sessionToken = refreshToken; }

        await authRecord.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === "production",
            sameSite: "lax", //"strict",
            path: "/" //auth/refresh-token",
        });
        //console.log("Cookies on request:", req.cookies);

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { _id: user._id, name: user.name, email: user.email }
        });        
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } 
};

export const refreshToken = async (req: express.Request, res: express.Response) => {
    console.log('@@ refreshToken called');

    const refreshToken = req.cookies.refreshToken; 
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        const decoded = verifyToken(refreshToken, true);  // Ensure second param is 'true' for refresh token
        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await UserModel.findById(decoded.id);
        if (!user || user.authentication.sessionToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateToken(user._id.toString(), user.roleType.toString());

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error verifying refresh token:", error);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};  
export const logout = async (req: express.Request, res: express.Response) => {
    res.clearCookie("refreshToken", { path: '/' });
    return res.status(200).json({ message: "Logged out successfully" });
};
export const register = async (req: express.Request, res: express.Response) => {
    console.log('@@ Register called');
    try {
        console.log("@@@ Incoming request body:", req.body);
        console.log("@@@ Incoming request file:", req.file ? req.file.originalname : "No file uploaded");
        
        const { name, email, password, phoneNumber, address, DOB, nationality, roleType, visaExpiryDate, idNumber } = req.body;

        const requiredFields = ['name', 'email', 'password', 'phoneNumber', 'address', 'DOB', 'nationality', 'roleType', 'idNumber'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: "Missing required information", missingFields });
        }

        const existingUser = await UserModel.findOne({ 
            $or: [{ email }, { idNumber }]
        });
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? "Email already exists" : "ID Number already exists" 
            });
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
            profileImage: req.file ? { 
                data: req.file.buffer, 
                contentType: req.file.mimetype
            } : null,            
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        
        console.log("@@@ User created successfully:", newUser);

        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("@@@ Error during registration:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
