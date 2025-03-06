import express from "express";
import authentication from "./router/authentication";
import users from "./router/users";
const userRouter = express.Router();

export default (): express.Router => {
    authentication(userRouter);
    users(userRouter);
    return userRouter;
}