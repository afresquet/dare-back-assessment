import Errors from "../types/Errors";
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
			res.status(Errors.FORBIDDEN.code).json(Errors.FORBIDDEN);
		}

		return;
	}

	// Find client
	const client = req.clients.find(c => c.id === id);

	if (!client) {
		// Not Found error
		res.status(Errors.NOT_FOUND.code).json(Errors.NOT_FOUND);

		return;
	}

	// Save client for later use
	req.clientById = client;

	next();
};

export default clientById;
