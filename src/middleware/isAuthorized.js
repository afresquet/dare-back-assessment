const isAuthorized = (req, res, next) => {
	if (!req.client) {
		// Unauthorized error
		res.status(401).json({
			code: 401,
			message: "Unauthorized",
		});

		return;
	}

	next();
};

export default isAuthorized;
