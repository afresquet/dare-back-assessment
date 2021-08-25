import axios from "axios";
import jwt from "jsonwebtoken";

// Ensures there's a valid token for every request
const withToken = () => {
	let token;
	let expiryDate;

	return async (req, res, next) => {
		// Check for token validity
		if (!token || Date.now() >= expiryDate) {
			const { type, token } = await axios.post(
				"https://dare-nodejs-assessment.herokuapp.com/api/login",
				{
					client_id: process.env.INSURANCE_API_CLIENT_ID,
					client_secret: process.env.INSURANCE_API_CLIENT_SECRET,
				}
			);

			// Decode token to access expiry date
			const { exp } = jwt.decode(token);

			// Save the values
			token = `${type} ${token}`;
			expiryDate = exp;
		}

		// Set the token for later use
		req.token = token;

		next();
	};
};

export default withToken;
