import request from "supertest";
import { getMockClients } from "../../../test-utils/mocks/clients";
import app from "../../app";
import Errors from "../../types/Errors";

describe("Routes - login", () => {
	const client = getMockClients({ index: 0 });

	let response;

	beforeAll(async () => {
		response = await request(app)
			.post("/api/v1/login")
			.send({ username: client.email, password: "password" });
	});

	test("responds with a token, its type and expiration date", () => {
		expect(response.statusCode).toBe(200);

		expect(response.body.type).toBe("Bearer");
		expect(response.body.token.length).toBeGreaterThan(0);
		expect(response.body.expires_in).toBeGreaterThan(0);
	});

	test("includes the token in the Authorization header", () => {
		expect(response.headers.authorization).toBe(
			`Bearer ${response.body.token}`
		);
	});

	test("responds with bad request error if there are missing parameters", async () => {
		const resp = await request(app).post("/api/v1/login").send({});

		expect(resp.statusCode).toBe(Errors.BAD_REQUEST.code);
		expect(resp.body).toEqual(Errors.BAD_REQUEST);
	});

	test("responds with unauthorized error if the client doesn't exist", async () => {
		const resp = await request(app)
			.post("/api/v1/login")
			.send({ username: "client@not.found", password: "password" });

		expect(resp.statusCode).toBe(Errors.UNAUTHORIZED.code);
		expect(resp.body).toEqual(Errors.UNAUTHORIZED);
	});
});
