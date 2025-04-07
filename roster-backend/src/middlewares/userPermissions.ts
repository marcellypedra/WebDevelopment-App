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

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      (req as any).user = decoded; // Temporarily assigning to bypass TS error
      next();
  } catch (error) {
      return res.status(403).json({ message: "Forbidden" });
  }
};

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: "!! Unauthorized !!" });
    }

    req.user = { _id: decoded._id, roleType: decoded.roleType };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const isManager = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Adjust based on how token is sent
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
/*
export const canUpdateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("canUpdateUser middleware called");
  try {
    const { id } = req.params;
    const identity = get(req, 'identity') as Identity;

    if (!identity) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (identity.roleType === "Manager" || identity._id.toString() === id) {
      console.log("Manager updating any user or user updating their own data.");
      return next();
  }  

    console.log("Unauthorized update attempt!");
    return res.status(403).json({ message: 'Unauthorized to update user data' });
  } catch (error) {
    console.error("Error in canUpdateUser middleware:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};*/
