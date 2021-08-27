import axios from "axios";
import jwt from "jsonwebtoken";

// Ensures there's a valid token for every request
const tokenAPI = () => {
	// Scoped cache
	let token = "";
	let expiryDate = 0;

	// Middleware
	return async (req, res, next) => {
		// Check for expiry date validity
		if (Date.now() >= expiryDate * 1000) {
			const { data } = await axios.post(
				"https://dare-nodejs-assessment.herokuapp.com/api/login",
				{
					client_id: process.env.INSURANCE_API_CLIENT_ID,
					client_secret: process.env.INSURANCE_API_CLIENT_SECRET,
				}
			);

			// Decode token to access expiry date
			const { exp } = jwt.decode(data.token);

			// Save in cache
			token = `${data.type} ${data.token}`;
			expiryDate = exp;
		}

		// Set the token for later use
		req.token = token;

		next();
	};
};

export default tokenAPI;
