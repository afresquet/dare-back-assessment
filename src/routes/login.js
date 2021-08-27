import express from "express";
import login from "../middleware/login";

const loginRouter = express.Router();

// Retrieve the auth token
loginRouter.post("/", login);

export default loginRouter;
