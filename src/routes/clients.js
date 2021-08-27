import express from "express";
import getClientPolicies from "../helpers/getClientPolicies";
import clientById from "../middleware/clientById";
import Roles from "../types/Roles";

const clientsRouter = express.Router();

// Get the list of clients details paginated and limited to 10 elements by default. This API endpoint access also an optional filter query to filter by client name.
// Can be accessed by client with role user (it will retrieve its own client details as only element of the list) and admin (it will retrieve all the clients list)
clientsRouter.get("/", (req, res) => {
	// Handle user client
	if (req.client.role !== Roles.ADMIN) {
		// Retrieve themselves
		res.json([req.client]);

		return;
	}

	const { limit = 10, name } = req.query;

	// List of clients details
	let clients = req.clients;

	if (name) {
		// Filter by name
		clients = clients.filter(client => client.name === name);
	}

	// Limit the amount
	clients = clients.slice(0, limit);

	res.json(clients);
});

// Get the client's details
// Can be accessed by client with role user (it will retrieve its own client details) and admin (it will retrieve any client details)
clientsRouter.get("/:id", clientById, (req, res) => {
	// Client's details
	res.json([req.clientById]);
});

// Get the client's policies
// Can be accessed by client with role user (it will retrieve its own client policy list) and admin (it will retrieve any client policy list)
clientsRouter.get("/:id/policies", clientById, (req, res) => {
	// Client's policies with metadata
	const policies = getClientPolicies(req.client, req.policies, true);

	res.json(policies);
});

export default clientsRouter;
