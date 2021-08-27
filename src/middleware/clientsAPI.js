import axios from "axios";
import getClientPolicies from "../helpers/getUserPolicies";

const clientsAPI = () => {
	let clients = [];
	let expiryDate = new Date(0);
	let etag = "";

	return async (req, res, next) => {
		try {
			if (Date.now() >= expiryDate.getTime()) {
				const { data, headers } = await axios.get(
					"https://dare-nodejs-assessment.herokuapp.com/api/clients",
					{
						headers: { Authorization: req.token, "If-None-Match": etag },
					}
				);

				clients = data.map(client => ({
					...client,
					policies: getClientPolicies(client, req.policies),
				}));

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

		// Set the clients for later use
		req.clients = clients;

		next();
	};
};

export default clientsAPI;
