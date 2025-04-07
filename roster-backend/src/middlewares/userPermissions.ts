import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../helpers/generateJWT";

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not provided" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(403).json({ message: "!! Unauthorized !!" });
      return;
    }
    
    req.user = { _id: decoded.id, roleType: decoded.roleType };
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid token" });
  }
};

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Adjust based on how token is sent
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      next();
    }

    const decoded = verifyToken(token);
    console.log("@@ Identity in isManager:", decoded);

    if (!decoded._id) {
      res.status(403).json({ message: "Invalid token: missing _id" });
      next();
    }

    if (decoded.roleType !== 'Manager') {
      res.status(403).json({ message: "Access denied: Not a Manager" });
      next();
    }

    req.user = { _id: decoded._id, roleType: decoded.roleType };
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
