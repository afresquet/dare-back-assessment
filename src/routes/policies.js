import express from "express";

const policiesRouter = express.Router();

// Get the list of policies' client paginated and limited to 10 elements by default.
policiesRouter.get("/", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own policies) and admin (it will retrieve all the policies)

	const { limit } = req.query;

	// List of policies' client
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

// Get the details of a policy's client
policiesRouter.get("/:id", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own policy) and admin (it will retrieve all the policies)

	const { id } = req.params;

	if (false) {
		// Not Found error
		res.status(403).json({
			code: 0,
			message: "string",
		});

		return;
	}

	if (false) {
		// Forbidden error
		res.status(404).json({
			code: 0,
			message: "string",
		});

		return;
	}

	// Get the details of a policy's client
	res.json({
		id: "string",
		amountInsured: "string",
		email: "string",
		inceptionDate: "string",
		installmentPayment: true,
	});
});

export default policiesRouter;
