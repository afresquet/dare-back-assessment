import express from "express";
import clientById from "../middleware/clientById";
import Roles from "../types/Roles";

const clientsRouter = express.Router();

//Get the list of clients details paginated and limited to 10 elements by default. This API endpoint access also an optional filter query to filter by client name.
clientsRouter.get("/", (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client details as only element of the list) and admin (it will retrieve all the clients list)

	if (req.client.role !== Roles.ADMIN) {
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
clientsRouter.get("/:id", clientById, (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client details) and admin (it will retrieve any client details)

	// Client's details
	res.json(req.clientById);
});

// Get the client's policies
clientsRouter.get("/:id/policies", clientById, (req, res) => {
	// Can be accessed by client with role user (it will retrieve its own client policy list) and admin (it will retrieve any client policy list)

	// Client's policies
	res.json(req.clientById.policies);
});

export default clientsRouter;
