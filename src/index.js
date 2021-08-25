import "dotenv/config";
import express from "express";
import withClients from "./middleware/withClients";
import withPolicies from "./middleware/withPolicies";
import withToken from "./middleware/withToken";
import router from "./routes";

// Initialize app
const app = express();

// Setup middleware
app.use(express.json());
app.use(withToken());
app.use(withPolicies());
app.use(withClients());

// Setup routes
app.use("/api/v1", router);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port} 🚀`);
});
