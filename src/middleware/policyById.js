import Roles from "../types/Roles";

const policyById = (req, res, next) => {
	const { id } = req.params;

	const policy = req.policies.find(p => p.id === id);

	if (!policy) {
		// Not Found error
		res.status(404).json({
			code: 404,
			message: "Policy not found",
		});

		return;
	}

	if (req.client.role !== Roles.ADMIN && req.client.id !== policy.clientId) {
		res.status(403).json({
			code: 403,
			message: "Forbidden",
		});

		return;
	}

	req.policyById = policy;

	next();
};

export default policyById;
