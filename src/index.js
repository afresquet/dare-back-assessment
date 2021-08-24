import "dotenv/config";
import express from "express";
import router from "./routes";

// Initialize app
const app = express();

// Setup middleware
app.use(express.json());

// Setup routes
app.use(router);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port} 🚀`);
});
