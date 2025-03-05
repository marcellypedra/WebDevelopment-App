import express from "express";
import authentication from "./router/authentication";
import users from "./router/users";
const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    return router;
}