import Roles from "../types/Roles";

const withClientById = (req, res, next) => {
	const { id } = req.params;

	if (req.client.role !== Roles.ADMIN) {
		if (req.client.id === id) {
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

	const client = req.clients.find(c => c.id === id);

	if (!client) {
		// Not Found error
		res.status(404).json({
			code: 404,
			message: "Client not found",
		});

		return;
	}

	req.clientById = client;

	next();
};

export default withClientById;
