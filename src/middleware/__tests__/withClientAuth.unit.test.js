import createClientToken from "../../helpers/createClientToken";
import { getMockClients } from "../../test-utils/mocks/clients";
import withClientAuth from "../withClientAuth";

describe("Middleware - withClientAuth", () => {
	const clients = getMockClients();

	process.env.JWT_SECRET = "secret";

	const mockRes = {
		status: jest.fn(() => mockRes),
		json: jest.fn(() => mockRes),
	};
	const mockNext = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("adds client to req when token is valid", () => {
		const client = clients[0];

		const token = createClientToken(client);

		const mockReq = {
			headers: { authorization: `Bearer ${token}` },
			clients,
		};

		withClientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.client).toBe(client);

		expect(mockRes.status).not.toHaveBeenCalled();

		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("responds with unauthorized status when the authorization header is missing", () => {
		const mockReq = { headers: {} };

		withClientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(401);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(401);
		expect(mockRes.json.mock.calls[0][0].message).toBe("Unauthorized");

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with unauthorized status when the client doesn't exist", () => {
		const badToken = createClientToken({ id: "some random id" });

		const mockReq = {
			headers: { authorization: `Bearer ${badToken}` },
			clients,
		};

		withClientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(401);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(401);
		expect(mockRes.json.mock.calls[0][0].message).toBe("Unauthorized");

		expect(mockNext).not.toHaveBeenCalled();
	});
});
