import { Request, Response, NextFunction } from "express";
export const isAuthenticated = (
  req: Request & { session: { userId?: string } },
  res: Response,
  next: Function
): void => {
  if (!req.session.userId) {
    res
      .status(401)
      .json({ message: "Not authorized. Please try logging in again" });
    return;
  }
  next();
};
