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

	// TODO: handle expired error
	const { clientId } = jwt.verify(token, process.env.JWT_SECRET);

	const client = req.clients.find(c => c.id === clientId);

	if (!client) {
		res.status(401).json(unauthorizedError);

		return;
	}

	req.client = client;

	next();
};

export default clientAuth;
