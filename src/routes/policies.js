import express from "express";
import getClientPolicies from "../helpers/getClientPolicies";
import policyById from "../middleware/policyById";
import Roles from "../types/Roles";

const policiesRouter = express.Router();

// Get the list of policies' client paginated and limited to 10 elements by default.
// Can be accessed by client with role user (it will retrieve its own policies) and admin (it will retrieve all the policies)
policiesRouter.get("/", async (req, res) => {
	// Handle user client
	if (req.client.role !== Roles.ADMIN) {
		// Retrieve their own policies
		res.json(getClientPolicies(req.client, req.policies, true));

		return;
	}

	const { limit = 10 } = req.query;

	// List of policies without clientId
	const policies = req.policies
		.slice(0, limit)
		.map(({ clientId, ...policy }) => policy);

	res.json(policies);
});

// Get the details of a policy's client
// Can be accessed by client with role user (it will retrieve its own policy) and admin (it will retrieve all the policies)
policiesRouter.get("/:id", policyById, (req, res) => {
	// Get the details of a policy's client
	res.json(req.policyById);
});

export default policiesRouter;
