import jwt from "jsonwebtoken";

const createClientToken = (client, expiry = 60 * 1000) => {
	return jwt.sign({ clientId: client.id }, process.env.JWT_SECRET, {
		expiresIn: expiry,
	});
};

export default createClientToken;
