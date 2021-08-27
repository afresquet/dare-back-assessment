import "dotenv/config";
import express from "express";
import clientsAPI from "./middleware/clientsAPI";
import policiesAPI from "./middleware/policiesAPI";
import tokenAPI from "./middleware/tokenAPI";
import router from "./routes";

// Initialize app
const app = express();

// Setup middleware
app.use(express.json());
app.use(tokenAPI());
app.use(policiesAPI());
app.use(clientsAPI());

// Setup routes
app.use("/api/v1", router);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port} 🚀`);
});
