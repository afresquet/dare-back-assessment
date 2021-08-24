import express from "express";

const clientsRouter = express.Router();

//Get the list of clients details paginated and limited to 10 elements by default. This API endpoint access also an optional filter query to filter by client name.
clientsRouter.get("/", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client details as only element of the list) and admin (it will retrieve all the clients list)

	const { limit, name } = req.query;

	// List of clients details
	res.json([
		{
			id: "string",
			name: "string",
			email: "string",
			role: "string",
			policies: [
				{
					id: "string",
					amountInsured: "string",
					inceptionDate: "string",
				},
			],
		},
	]);
});

// Get the client's details
clientsRouter.get("/:id", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client details) and admin (it will retrieve any client details)

	const { id } = req.params;

	if (false) {
		// Forbidden error
		res.status(403).json({
			code: 0,
			message: "string",
		});

		return;
	}

	if (false) {
		// Not Found error
		res.status(404).json({
			code: 0,
			message: "string",
		});

		return;
	}

	// Client's details
	res.json([
		{
			id: "string",
			name: "string",
			email: "string",
			role: "string",
			policies: [
				{
					id: "string",
					amountInsured: "string",
					inceptionDate: "string",
				},
			],
		},
	]);
});

// Get the client's policies
clientsRouter.get("/:id/policies", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client policy list) and admin (it will retrieve any client policy list)

	const { id } = req.params;

	if (false) {
		// Forbidden error
		res.status(403).json({
			code: 0,
			message: "string",
		});

		return;
	}

	if (false) {
		// Not Found error
		res.status(404).json({
			code: 0,
			message: "string",
		});

		return;
	}

	// Client's policies
	res.json([
		{
			id: "string",
			amountInsured: "string",
			email: "string",
			inceptionDate: "string",
			installmentPayment: true,
		},
	]);
});

export default clientsRouter;
