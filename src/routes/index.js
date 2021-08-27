import express from "express";
import clientAuth from "../middleware/clientAuth";
import clientsRouter from "./clients";
import loginRouter from "./login";
import policiesRouter from "./policies";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/policies", clientAuth, policiesRouter);
router.use("/clients", clientAuth, clientsRouter);

export default router;
