import express from "express";
import isAuthorized from "../middleware/isAuthorized";
import clientsRouter from "./clients";
import loginRouter from "./login";
import policiesRouter from "./policies";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/policies", isAuthorized, policiesRouter);
router.use("/clients", isAuthorized, clientsRouter);

export default router;
