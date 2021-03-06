import createClientToken from "../helpers/createClientToken";
import Errors from "../types/Errors";

const login = (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		// Bad request
		res.status(Errors.BAD_REQUEST.code).json(Errors.BAD_REQUEST);

		return;
	}

	// TODO: handle password (don't know how without sign up endpoint)

	// Find client
	const client = req.clients.find(c => c.email === username);

	if (!client) {
		// Unauthorized error
		res.status(Errors.UNAUTHORIZED.code).json(Errors.UNAUTHORIZED);

		return;
	}

	// Create token
	const type = "Bearer";
	const expiry = 60 * 60 * 1000;
	const token = createClientToken(client, expiry);

	// Set token in header
	res.setHeader("Authorization", `${type} ${token}`);

	// Return a valid Bearer access token for the valid client_credentials provided. The token has a time to live equal to expires_in
	res.json({ type, token, expires_in: expiry });
};

export default login;
