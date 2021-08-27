import "dotenv/config";
import app from "./app";

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port} 🚀`);
});
