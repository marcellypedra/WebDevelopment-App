import express from "express";
import authenticationRouter from "./router/authentication";
import usersRouter from "./router/users";
import shiftsRouter from './router/shifts'

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/users', usersRouter);
router.use('/shifts', shiftsRouter);

router.get("/", (req, res) => {
    res.send("Roster API is running 🚀");
});

export default router;