import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

interface Identity {
  roleType: string;
  _id: { toString: () => string };
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("@@ isAuthenticated called");

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
  console.log("@@ isManager middleware called");
  try {
    const identity = get(req, 'identity') as Identity;
    console.log("@@ Identity in isManager:", identity);

    if (!identity) return res.status(403).json({ message: '!! Unauthorized !!' });
    console.log("@@ Role type in isManager:", identity.roleType);

    if (identity.roleType !== 'Manager') {
      return res.status(403).json({ message: '!! You do not have permission to access this resource !!' });
    }
    console.log("User is a Manager >>>");
    next();
  } catch (error) {
    console.error("Error in isManager middleware:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

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
};
