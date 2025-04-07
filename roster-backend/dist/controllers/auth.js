"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.logout = exports.refreshToken = exports.login = void 0;
const users_1 = require("../db/users");
const generateJWT_1 = require("../helpers/generateJWT");
const encryptedPassword_1 = require("../helpers/encryptedPassword");
const login = async (req, res) => {
    console.log('@@ Login called');
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await (0, users_1.getUserByEmail)(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log("Found User:", user.email);
        const expectedHash = (0, encryptedPassword_1.authentication)(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            res.status(403).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = (0, generateJWT_1.generateToken)(user._id.toString(), user.roleType.toString());
        const refreshToken = (0, generateJWT_1.generateRefreshToken)(user._id.toString());
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
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    console.log('@@ refreshToken called');
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token required" });
        return;
    }
    try {
        const decoded = (0, generateJWT_1.verifyToken)(refreshToken, true); // Ensure second param is 'true' for refresh token
        if (!decoded || !decoded.id) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        const user = await users_1.UserModel.findById(decoded.id);
        if (!user || user.authentication.sessionToken !== refreshToken) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        const newAccessToken = (0, generateJWT_1.generateToken)(user._id.toString(), user.roleType.toString());
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error("Error verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    res.clearCookie("refreshToken", { path: '/' });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const register = async (req, res) => {
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
        const existingUser = await users_1.UserModel.findOne({
            $or: [{ email }, { idNumber }]
        });
        if (existingUser) {
            res.status(400).json({
                message: existingUser.email === email ? "Email already exists" : "ID Number already exists"
            });
            return;
        }
        const salt = (0, encryptedPassword_1.random)();
        const newUser = await (0, users_1.createUser)({
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
                password: (0, encryptedPassword_1.authentication)(salt, password)
            }
        });
        console.log("@@@ User created successfully:", newUser);
        res.status(201).json({ message: "User created successfully", newUser });
    }
    catch (error) {
        console.error("@@@ Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.register = register;
