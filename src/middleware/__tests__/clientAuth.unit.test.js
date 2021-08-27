import { getMockClients } from "../../../test-utils/mocks/clients";
import createClientToken from "../../helpers/createClientToken";
import Errors from "../../types/Errors";
import clientAuth from "../clientAuth";

describe("Middleware - clientAuth", () => {
	const clients = getMockClients();

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

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.client).toBe(client);

		expect(mockRes.status).not.toHaveBeenCalled();

		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("responds with unauthorized status when the authorization header is missing", () => {
		const mockReq = { headers: {} };

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.UNAUTHORIZED.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.UNAUTHORIZED);

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with unauthorized status when the client doesn't exist", () => {
		const badToken = createClientToken({ id: "some random id" });

		const mockReq = {
			headers: { authorization: `Bearer ${badToken}` },
			clients,
		};

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.UNAUTHORIZED.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.UNAUTHORIZED);

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with unauthorized status when the token is expired", () => {
		const badToken = createClientToken(clients[0], 0);

		const mockReq = {
			headers: { authorization: `Bearer ${badToken}` },
			clients,
		};

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.UNAUTHORIZED.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.UNAUTHORIZED);

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with unauthorized status when the token isn't a jwt", () => {
		const mockReq = {
			headers: { authorization: "Bearer bad_token" },
			clients,
		};

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.UNAUTHORIZED.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.UNAUTHORIZED);

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with internal error status when another error happens", () => {
		const mockReq = {
			headers: { authorization: "Bearer " },
			clients,
		};

		clientAuth(mockReq, mockRes, mockNext);

		expect(mockReq.clientById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(500);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(500);

		expect(mockNext).not.toHaveBeenCalled();
	});
});
