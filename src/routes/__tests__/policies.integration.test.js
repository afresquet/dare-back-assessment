import request from "supertest";
import { getMockClients } from "../../../test-utils/mocks/clients";
import { getMockPolicies } from "../../../test-utils/mocks/policies";
import app from "../../app";
import createClientToken from "../../helpers/createClientToken";
import Errors from "../../types/Errors";

describe("Route - policies", () => {
	// Not ideal, depends on server data never changing, but I don't have access to a test environment
	const adminClient = getMockClients({ index: 0 });
	const adminToken = `Bearer ${createClientToken(adminClient)}`;
	const userClient = getMockClients({ index: 2 });
	const userToken = `Bearer ${createClientToken(userClient)}`;

	const policies = getMockPolicies();

	describe("GET /", () => {
		test("responds with unauthorized error if not logged in", async () => {
			const [responseAdmin, responseUser] = await Promise.all([
				request(app).get("/api/v1/policies"),
				request(app).get("/api/v1/policies"),
			]);

			expect(responseAdmin.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseAdmin.body).toEqual(Errors.UNAUTHORIZED);

			expect(responseUser.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseUser.body).toEqual(Errors.UNAUTHORIZED);
		});

		describe("user", () => {
			test("responds with own client policies (no user client has policies currently)", async () => {
				const response = await request(app)
					.get("/api/v1/policies")
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(0);
			});
		});

		describe("admin", () => {
			test("responds with an array of 10 policies", async () => {
				const response = await request(app)
					.get("/api/v1/policies")
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(10);
			});

			test("responds with an array of a set amount of policies", async () => {
				const limit = 5;

				const response = await request(app)
					.get(`/api/v1/policies?limit=${limit}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body).toHaveLength(limit);
			});
		});
	});

	describe("GET /:id", () => {
		test("responds with unauthorized error if not logged in", async () => {
			const [responseAdmin, responseUser] = await Promise.all([
				request(app).get("/api/v1/policies/some_random_id"),
				request(app).get("/api/v1/policies/some_random_id"),
			]);

			expect(responseAdmin.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseAdmin.body).toEqual(Errors.UNAUTHORIZED);

			expect(responseUser.statusCode).toBe(Errors.UNAUTHORIZED.code);
			expect(responseUser.body).toEqual(Errors.UNAUTHORIZED);
		});

		describe("user", () => {
			test("responds with own client policy (no user client has policies currently)", async () => {
				const response = await request(app)
					.get("/api/v1/policies/some_random_id")
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(Errors.NOT_FOUND.code);

				expect(response.body).toEqual(Errors.NOT_FOUND);
			});

			test("responds with forbidden error if searches for a policy of another client", async () => {
				const response = await request(app)
					.get(`/api/v1/policies/${policies[0].id}`)
					.set("Authorization", userToken);

				expect(response.statusCode).toBe(Errors.FORBIDDEN.code);

				expect(response.body).toEqual(Errors.FORBIDDEN);
			});
		});

		describe("admin", () => {
			test("responds with the requested policy", async () => {
				const policy = policies[0];

				const response = await request(app)
					.get(`/api/v1/policies/${policy.id}`)
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(200);

				expect(response.body[0].id).toEqual(policy.id);
			});

			test("responds with not found status if the policy doesn't exist", async () => {
				const response = await request(app)
					.get("/api/v1/policies/some_random_id")
					.set("Authorization", adminToken);

				expect(response.statusCode).toBe(Errors.NOT_FOUND.code);

				expect(response.body).toEqual(Errors.NOT_FOUND);
			});
		});
	});
});
