import { Request } from "express";
import session from "express-session";

export interface AuthenticatedRequest extends Request {
  session: session.Session &
    Partial<session.SessionData> & {
      userId?: string;
    };
}
