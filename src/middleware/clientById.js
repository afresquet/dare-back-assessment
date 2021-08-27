import Roles from "../types/Roles";

const clientById = (req, res, next) => {
	const { id } = req.params;

	// Handle user client
	if (req.client.role !== Roles.ADMIN) {
		if (req.client.id === id) {
			// Searching for themselves
			req.clientById = req.client;

			next();
		} else {
			res.status(403).json({
				code: 403,
				message: "Forbidden",
			});
		}

		return;
	}

	// Find client
	const client = req.clients.find(c => c.id === id);

	if (!client) {
		// Not Found error
		res.status(404).json({
			code: 404,
			message: "Client not found",
		});

		return;
	}

	// Save client for later use
	req.clientById = client;

	next();
};

export default clientById;
