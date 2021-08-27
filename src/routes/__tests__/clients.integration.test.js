import request from "supertest";
import { getMockClients } from "../../../test-utils/mocks/clients";
import app from "../../app";
import createClientToken from "../../helpers/createClientToken";
import Errors from "../../types/Errors";

describe("Routes - clients", () => {
	// Not ideal, depends on server data never changing, but I don't have access to a test environment
	const adminClient = getMockClients({ index: 0 });
	const adminToken = `Bearer ${createClientToken(adminClient)}`;
	const userClient = getMockClients({ index: 2 });
	const userToken = `Bearer ${createClientToken(userClient)}`;

	describe("GET /", () => {
		test("responds with unauthorized error if not logged in", async () => {
			const response = await request(app).get("/api/v1/clients");

			expect(response.statusCode).toBe(Errors.UNAUTHORIZED.code);

			expect(response.body).toEqual(Errors.UNAUTHORIZED);
		});

		describe("user", () => {
			test("responds with own client details", async () => {
				const response = await request(app)
					.get("/api/v1/clients")
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(200);

				expect(response.body[0].id).toBe(userClient.id);
			});
		});

		describe("admin", () => {
			test("responds with an array of 10 clients", async () => {
				const response = await request(app)
					.get("/api/v1/clients")
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(10);
			});

			test("responds with an array of a set amount clients", async () => {
				const limit = 5;

				const response = await request(app)
					.get(`/api/v1/clients?limit=${limit}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(limit);
			});

			test("responds with an array of clients with a certain name", async () => {
				const response = await request(app)
					.get(`/api/v1/clients?name=${userClient.name}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(1);
				expect(response.body[0].name).toBe(userClient.name);
			});
		});
	});

	describe("GET /:id", () => {
		test("responds with unauthorized error if not logged in", async () => {
			const [responseAdmin, responseUser] = await Promise.all([
				request(app).get(`/api/v1/clients/${adminClient.id}`),
				request(app).get(`/api/v1/clients/${userClient.id}`),
			]);

			expect(responseAdmin.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseAdmin.body).toEqual(Errors.UNAUTHORIZED);

			expect(responseUser.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseUser.body).toEqual(Errors.UNAUTHORIZED);
		});

		describe("user", () => {
			test("responds with own client details", async () => {
				const response = await request(app)
					.get(`/api/v1/clients/${userClient.id}`)
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(200);

				expect(response.body[0].id).toBe(userClient.id);
			});

			test("responds with forbidden status if searches for another client", async () => {
				const response = await request(app)
					.get(`/api/v1/clients/${adminClient.id}`)
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(Errors.FORBIDDEN.code);

				expect(response.body).toEqual(Errors.FORBIDDEN);
			});
		});

		describe("admin", () => {
			test("responds with own client details", async () => {
				const response = await request(app)
					.get(`/api/v1/clients/${adminClient.id}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body[0].id).toBe(adminClient.id);
			});

			test("responds with any client details", async () => {
				const response = await request(app)
					.get(`/api/v1/clients/${userClient.id}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body[0].id).toBe(userClient.id);
			});

			test("responds with not found error if the client doesn't exist", async () => {
				const response = await request(app)
					.get("/api/v1/clients/some_random_id")
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(Errors.NOT_FOUND.code);

				expect(response.body).toEqual(Errors.NOT_FOUND);
			});
		});
	});
});
