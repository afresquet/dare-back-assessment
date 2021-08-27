import axios from "axios";
import getClientPolicies from "../helpers/getUserPolicies";

const clientsAPI = () => {
	// Scoped cache
	let clients = [];
	let expiryDate = new Date(0);
	let etag = "";

	// Middleware
	return async (req, res, next) => {
		try {
			// Check for expiry date validity
			if (Date.now() >= expiryDate.getTime()) {
				// Fetch clients
				const { data, headers } = await axios.get(
					"https://dare-nodejs-assessment.herokuapp.com/api/clients",
					{
						headers: { Authorization: req.token, "If-None-Match": etag },
					}
				);

				// Map clients to add their policies and save in cache
				clients = data.map(client => ({
					...client,
					policies: getClientPolicies(client, req.policies),
				}));

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

		// Save the clients for later use
		req.clients = clients;

		next();
	};
};

export default clientsAPI;
