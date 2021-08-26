import jwt from "jsonwebtoken";
import { getMockClients } from "../../test-utils/mocks/clients";
import createClientToken from "../createClientToken";

describe("Helpers - createClientToken", () => {
	const client = getMockClients({ index: 0 });

	process.env.JWT_SECRET = "secret";

	const token = createClientToken(client);
	const payload = jwt.decode(token);

	test("creates a token for the client", () => {
		expect(token.length).toBeGreaterThan(0);
	});

	test("token has the client's id in the payload", () => {
		expect(payload.clientId).toBe(client.id);
	});

	test("token has an expiration date", () => {
		expect(payload.exp).toBeGreaterThan(0);
	});
});
