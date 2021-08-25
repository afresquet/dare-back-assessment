import express from "express";
import withPolicyById from "../middleware/withPolicyById";
import Roles from "../types/Roles";

const policiesRouter = express.Router();

// Get the list of policies' client paginated and limited to 10 elements by default.
policiesRouter.get("/", async (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own policies) and admin (it will retrieve all the policies)

	if (req.client.role !== Roles.ADMIN) {
		res.json([req.client.policies]);

		return;
	}

	const { limit = 10 } = req.query;

	// List of policies' client
	res.json(req.policies.slice(0, limit));
});

// Get the details of a policy's client
policiesRouter.get("/:id", withPolicyById, (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own policy) and admin (it will retrieve all the policies)

	// Get the details of a policy's client
	res.json(req.policyById);
});

export default policiesRouter;
