import express from "express";
import withClientAuth from "../middleware/withClientAuth";
import clientsRouter from "./clients";
import loginRouter from "./login";
import policiesRouter from "./policies";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/policies", withClientAuth, policiesRouter);
router.use("/clients", withClientAuth, clientsRouter);

export default router;
