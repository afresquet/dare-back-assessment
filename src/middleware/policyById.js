import Errors from "../types/Errors";
import Roles from "../types/Roles";

const policyById = (req, res, next) => {
	const { id } = req.params;

	// Find policy
	const policy = req.policies.find(p => p.id === id);

	if (!policy) {
		// Not Found error
		res.status(Errors.NOT_FOUND.code).json(Errors.NOT_FOUND);

		return;
	}

	// Destructure to remove clientId
	const { clientId, ...rest } = policy;

	// Check if client isn't and admin and is looking for a policy that is not theirs
	if (req.client.role !== Roles.ADMIN && req.client.id !== clientId) {
		res.status(Errors.FORBIDDEN.code).json(Errors.FORBIDDEN);

		return;
	}

	// Save policy for later use
	req.policyById = rest;

	next();
};

export default policyById;
