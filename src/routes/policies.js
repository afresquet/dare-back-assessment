import express from "express";
import policyById from "../middleware/policyById";
import Roles from "../types/Roles";

const policiesRouter = express.Router();

// Get the list of policies' client paginated and limited to 10 elements by default.
// Can be accessed by client with role user (it will retrieve its own policies) and admin (it will retrieve all the policies)
policiesRouter.get("/", async (req, res) => {
	// Handle user client
	if (req.client.role !== Roles.ADMIN) {
		// Retrieve their own policies
		res.json(req.client.policies);

		return;
	}

	const { limit = 10 } = req.query;

	// List of policies' client
	res.json(req.policies.slice(0, limit));
});

// Get the details of a policy's client
// Can be accessed by client with role user (it will retrieve its own policy) and admin (it will retrieve all the policies)
policiesRouter.get("/:id", policyById, (req, res) => {
	// Get the details of a policy's client
	res.json(req.policyById);
});

export default policiesRouter;
