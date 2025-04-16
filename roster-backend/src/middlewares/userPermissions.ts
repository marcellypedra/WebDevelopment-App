import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../helpers/generateJWT";
import jwt from 'jsonwebtoken';

export interface Identity {
  roleType: string;
  _id: string;
}
export interface AuthenticatedRequest extends Request {
  user?: Identity;
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = { _id: decoded._id, roleType: decoded.roleType };

    next();
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    return res.status(403).json({ message: "Invalid token" });  }
};

export const isManager = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 
      if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Identity;
      console.log("@@ Identity in isManager:", decoded);

      if (!decoded._id) {
          return res.status(403).json({ message: "Invalid token: missing _id" });
      }

      if (decoded.roleType !== 'Manager') {
          return res.status(403).json({ message: "Access denied: Not a Manager" });
      }

      req.user = decoded; 
      next();
  } catch (error) {
      console.error("Error in isManager middleware:", error);
      res.status(401).json({ message: "Unauthorized" });
  }
};