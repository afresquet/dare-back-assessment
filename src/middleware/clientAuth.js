import jwt from "jsonwebtoken";
import Errors from "../types/Errors";

const clientAuth = (req, res, next) => {
	// Check for Authorization header
	if (!req.headers.authorization) {
		res.status(Errors.UNAUTHORIZED.code).json(Errors.UNAUTHORIZED);

		return;
	}

	const [type, token] = req.headers.authorization.split(" ");

	let clientId;

	try {
		// Verify that token is valid
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		clientId = payload.clientId;
	} catch ({ message }) {
		let error = {
			code: 500,
			message,
		};

		if (message === "jwt expired" || message === "jwt malformed") {
			error = Errors.UNAUTHORIZED;
		}

		res.status(error.code).json(error);

		return;
	}

	// Find the client
	const client = req.clients.find(c => c.id === clientId);

	if (!client) {
		res.status(Errors.UNAUTHORIZED.code).json(Errors.UNAUTHORIZED);

		return;
	}

	req.client = client;

	next();
};

export default clientAuth;
