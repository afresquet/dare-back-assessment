import jwt from "jsonwebtoken";

const unauthorizedError = {
	code: 401,
	message: "Unauthorized",
};

const clientAuth = (req, res, next) => {
	if (!req.headers.authorization) {
		res.status(401).json(unauthorizedError);

		return;
	}

	const [type, token] = req.headers.authorization.split(" ");

	let clientId;

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		clientId = payload.clientId;
	} catch (error) {
		let code = 500;
		let message = error.message;

		if (error.message === "jwt expired") {
			code = 401;
			message = "Unauthorized, please log in";
		} else if (error.message === "jwt malformed") {
			code = 401;
			message = "Invalid token";
		}

		res.status(code).json({ code, message });

		return;
	}

	const client = req.clients.find(c => c.id === clientId);

	if (!client) {
		res.status(401).json(unauthorizedError);

		return;
	}

	req.client = client;

	next();
};

export default clientAuth;
