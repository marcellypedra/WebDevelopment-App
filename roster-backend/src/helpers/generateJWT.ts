import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface Identity {
    roleType: string;
    _id: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateToken = (_id: string, roleType: string) => {
    return jwt.sign({ _id: _id, roleType }, JWT_SECRET, { expiresIn: '10m' });
};

export const generateRefreshToken = (_id: string) => {
    return jwt.sign({ _id: _id }, JWT_REFRESH_SECRET, { expiresIn: '20m' }); 
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