const isAuthorized = (req, res, next) => {
	if (false) {
		// Unauthorized error
		res.status(401).json({
			code: 0,
			message: "string",
		});

		return;
	}

	next();
};

export default isAuthorized;
