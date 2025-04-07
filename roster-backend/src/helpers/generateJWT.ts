import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

export   interface Identity {
    roleType: string;
    _id: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateToken = (_id: string, roleType: string) => {
    return jwt.sign({ id: _id, roleType }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (_id: string) => {
    return jwt.sign({ id: _id }, JWT_REFRESH_SECRET, { expiresIn: '30m' }); 
};

export const verifyToken = (token: string, isRefreshToken = false) => {
    try {
        const secret = isRefreshToken ? JWT_REFRESH_SECRET : JWT_SECRET;
        return jwt.verify(token, secret) as any;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};