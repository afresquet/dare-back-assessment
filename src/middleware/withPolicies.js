import axios from "axios";

const withPolicies = () => {
	// TODO: take variable outside of this scope
	let policies;

	return async (req, res, next) => {
		// TODO: Check for etag caching validity
		if (!policies) {
			const { data } = await axios.post(
				"https://dare-nodejs-assessment.herokuapp.com/api/policies",
				null,
				{ headers: { authorization: req.token } }
			);

			// Create object with the client ids as the key for easier use
			policies = data;
		}

		// Set the token for later use
		req.policies = policies;

		next();
	};
};

export default withPolicies;
