import axios from "axios";

const policiesAPI = () => {
	// Scoped cache
	let policies = [];
	let expiryDate = new Date(0);
	let etag = "";

	// Middleware
	return async (req, res, next) => {
		try {
			// Check for expiry date validity
			if (Date.now() >= expiryDate.getTime()) {
				// Fetch policies
				const { data, headers } = await axios.get(
					"https://dare-nodejs-assessment.herokuapp.com/api/policies",
					{ headers: { Authorization: req.token, "If-None-Match": etag } }
				);

				// Save policies in cache
				policies = data;

				// Save header data in cache
				expiryDate = new Date(headers.expires);
				etag = headers.etag;
			}
		} catch ({ response: { status, statusMessage, headers } }) {
			// Only send error status if it's not 304 Not Modified
			if (status !== 304) {
				res.status(status).json({
					code: status,
					message: statusMessage,
				});

				return;
			}

			// Save header data in cache
			expiryDate = new Date(headers.expires);
			etag = headers.etag;
		}

		// Save the policies for later use
		req.policies = policies;

		next();
	};
};

export default policiesAPI;
