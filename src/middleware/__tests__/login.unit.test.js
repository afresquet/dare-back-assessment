import { getMockClients } from "../../../test-utils/mocks/clients";
import Errors from "../../types/Errors";
import login from "../login";

describe("Middleware - login", () => {
	const clients = getMockClients();

	const mockRes = {
		setHeader: jest.fn(() => mockRes),
		status: jest.fn(() => mockRes),
		json: jest.fn(() => mockRes),
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("Responds with token, its type and its expiration date", () => {
		const mockReq = {
			body: { username: clients[0].email, password: "password" },
			clients,
		};

		login(mockReq, mockRes);

		expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
		expect(mockRes.setHeader).toHaveBeenCalledWith(
			"Authorization",
			`Bearer ${mockRes.json.mock.calls[0][0].token}`
		);

		expect(mockRes.status).not.toHaveBeenCalled();

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].type).toBe("Bearer");
		expect(mockRes.json.mock.calls[0][0].token.length).toBeGreaterThan(0);
		expect(mockRes.json.mock.calls[0][0].expires_in).toBeGreaterThan(0);
	});

	test("responds with bad request status if there are missing parameters", () => {
		const mockReq = { body: {} };

		login(mockReq, mockRes);

		expect(mockRes.setHeader).not.toHaveBeenCalled();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.BAD_REQUEST.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.BAD_REQUEST);
	});

	test("responds with unauthorized status if the client doesn't exist", () => {
		const mockReq = {
			body: { username: "username", password: "password" },
			clients,
		};

		login(mockReq, mockRes);

		expect(mockRes.setHeader).not.toHaveBeenCalled();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(Errors.UNAUTHORIZED.code);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json).toHaveBeenCalledWith(Errors.UNAUTHORIZED);
	});
});
