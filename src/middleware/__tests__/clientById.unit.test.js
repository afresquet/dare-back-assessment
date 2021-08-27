import { getMockClients } from "../../../test-utils/mocks/clients";
import Errors from "../../types/Errors";
import clientById from "../clientById";

describe("Middleware - clientById", () => {
	const adminClient = getMockClients({ index: 0 });
	const userClient = getMockClients({ index: 2 });

	const mockRes = {
		status: jest.fn(() => mockRes),
		json: jest.fn(() => mockRes),
	};
	const mockNext = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("user client", () => {
		test("adds client to req when searching themselves", () => {
			const mockReq = { params: { id: userClient.id }, client: userClient };

			clientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBe(userClient);

			expect(mockRes.status).not.toHaveBeenCalled();

			expect(mockRes.json).not.toHaveBeenCalled();

			expect(mockNext).toHaveBeenCalledTimes(1);
		});

		test("responds with forbidden status when searching another client", () => {
			const mockReq = { params: { id: adminClient.id }, client: userClient };

			clientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBeUndefined();

			expect(mockRes.status).toHaveBeenCalledTimes(1);
			expect(mockRes.status).toHaveBeenCalledWith(Errors.FORBIDDEN.code);

			expect(mockRes.json).toHaveBeenCalledTimes(1);
			expect(mockRes.json).toHaveBeenCalledWith(Errors.FORBIDDEN);

			expect(mockNext).not.toHaveBeenCalled();
		});
	});

	describe("admin client", () => {
		const clients = getMockClients();

		test("adds client to req when searching for an existing client", () => {
			const targetClient = clients[5];

			const mockReq = {
				params: { id: targetClient.id },
				client: adminClient,
				clients,
			};

			clientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBe(targetClient);

			expect(mockRes.status).not.toHaveBeenCalled();

			expect(mockRes.json).not.toHaveBeenCalled();

			expect(mockNext).toHaveBeenCalledTimes(1);
		});

		test("responds with not found status when the client doesn't exist", () => {
			const mockReq = {
				params: { id: "some random id" },
				client: adminClient,
				clients,
			};

			clientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBeUndefined();

			expect(mockRes.status).toHaveBeenCalledTimes(1);
			expect(mockRes.status).toHaveBeenCalledWith(Errors.NOT_FOUND.code);

			expect(mockRes.json).toHaveBeenCalledTimes(1);
			expect(mockRes.json).toHaveBeenCalledWith(Errors.NOT_FOUND);

			expect(mockNext).not.toHaveBeenCalled();
		});
	});
});
