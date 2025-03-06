import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/userModel';

interface Identity {
  roleType: string;
  _id: { toString: () => string };
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("isAuthenticated middleware called");

  try {
    const sessionToken = req.cookies['ROSTER-AUTH'];
    console.log('Session Token from Cookie:', sessionToken);

    if (!sessionToken) {
      console.log('No session token found!');
      return res.sendStatus(403);
    }

    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      console.log('No user found for this session token!');
      return res.sendStatus(403);
    }

    console.log('Authenticated User:', user);
    merge(req, { identity: user as Identity });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isManager = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("isManager middleware called");
  try {
    const identity = get(req, 'identity') as Identity | undefined;
    console.log("Identity in isManager:", identity);

    if (!identity) {
      console.log("No identity found in isManager");
      return res.sendStatus(403);
    }
    console.log("Role type in isManager:", identity.roleType);

    if (identity.roleType !== 'Manager') {
      console.log("User is not a Manager");
      return res.sendStatus(403);
    }
    console.log("User is a Manager, proceeding to next middleware");
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const canUpdateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("canUpdateUser middleware called");
  try {
    const { id } = req.params;
    const identity = get(req, 'identity') as Identity | undefined;

    if (!identity) {
      return res.sendStatus(403);
    }

    if (identity.roleType === "Manager" || identity._id.toString() === id) {
      console.log("Manager updating any user or user updating their own data.");
      return next();
  }  

    console.log("Unauthorized update attempt!");
    return res.sendStatus(403);
  } catch (error) {
    console.error("Error in update user function:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
