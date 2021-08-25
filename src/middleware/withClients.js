import axios from "axios";
import getClientPolicies from "../helpers/getUserPolicies";

const withClients = () => {
	// TODO: take variable outside of this scope
	let clients;

	return async (req, res, next) => {
		// TODO: Check for etag caching validity
		if (!clients) {
			const { data } = await axios.get(
				"https://dare-nodejs-assessment.herokuapp.com/api/clients",
				{ headers: { Authorization: req.token } }
			);

			clients = data.map(client => ({
				...client,
				policies: getClientPolicies(client, req.policies),
			}));
		}

		// Set the clients for later use
		req.clients = clients;

		next();
	};
};

export default withClients;
