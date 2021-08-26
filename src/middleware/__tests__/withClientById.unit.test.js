import { getMockClients } from "../../test-utils/mocks/clients";
import withClientById from "../withClientById";

describe("Middleware - withClientById", () => {
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

			withClientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBe(userClient);

			expect(mockRes.status).not.toHaveBeenCalled();

			expect(mockRes.json).not.toHaveBeenCalled();

			expect(mockNext).toHaveBeenCalledTimes(1);
		});

		test("responds with forbidden status when searching another client", () => {
			const mockReq = { params: { id: adminClient.id }, client: userClient };

			withClientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBeUndefined();

			expect(mockRes.status).toHaveBeenCalledTimes(1);
			expect(mockRes.status).toHaveBeenCalledWith(403);

			expect(mockRes.json).toHaveBeenCalledTimes(1);
			expect(mockRes.json.mock.calls[0][0].code).toBe(403);
			expect(mockRes.json.mock.calls[0][0].message).toBe("Forbidden");

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

			withClientById(mockReq, mockRes, mockNext);

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

			withClientById(mockReq, mockRes, mockNext);

			expect(mockReq.clientById).toBeUndefined();

			expect(mockRes.status).toHaveBeenCalledTimes(1);
			expect(mockRes.status).toHaveBeenCalledWith(404);

			expect(mockRes.json).toHaveBeenCalledTimes(1);
			expect(mockRes.json.mock.calls[0][0].code).toBe(404);
			expect(mockRes.json.mock.calls[0][0].message).toBe("Client not found");

			expect(mockNext).not.toHaveBeenCalled();
		});
	});
});
