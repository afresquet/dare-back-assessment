import express from "express";

const loginRouter = express.Router();

// Retrieve the auth token
loginRouter.post("/", (req, res) => {
	const { username, password } = req.body;

	if (false) {
		// Bad request
		res.status(400).json({
			code: 0,
			message: "string",
		});

		return;
	}

	// Return a valid Bearer access token for the valid client_credentials provided. The token has a time to live equal to expires_in
	res.json({
		token: "string",
		type: "string",
		expires_in: 0,
	});
});

export default loginRouter;
