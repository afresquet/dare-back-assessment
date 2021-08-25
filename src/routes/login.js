import express from "express";

const loginRouter = express.Router();

// Retrieve the auth token
loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		// Bad request
		res.status(400).json({
			code: 400,
			message: "Invalid inputs",
		});

		return;
	}

	const client = req.clients.find(c => c.email === username);

	if (!client) {
		// Unauthorized error
		res.status(401).json({
			code: 401,
			message: "Unauthorized",
		});

		return;
	}

	// TODO: create user token
	res.setHeader("Authorization", req.token);

	// Return a valid Bearer access token for the valid client_credentials provided. The token has a time to live equal to expires_in
	res.json({ type, token, expires_in: 0 });
});

export default loginRouter;
