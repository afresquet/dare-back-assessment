import axios from "axios";

const withPolicies = () => {
	let policies = [];
	let expiryDate = new Date(0);
	let etag = "";

	return async (req, res, next) => {
		try {
			if (Date.now() >= expiryDate.getTime()) {
				const { data, headers } = await axios.get(
					"https://dare-nodejs-assessment.herokuapp.com/api/policies",
					{ headers: { Authorization: req.token, "If-None-Match": etag } }
				);

				policies = data;

				expiryDate = new Date(headers.expires);
				etag = headers.etag;
			}
		} catch ({ response: { status, statusMessage, headers } }) {
			if (status !== 304) {
				res.status(status).json({
					code: status,
					message: statusMessage,
				});

				return;
			}

			expiryDate = new Date(headers.expires);
			etag = headers.etag;
		}

		// Set the policies for later use
		req.policies = policies;

		next();
	};
};

export default withPolicies;
