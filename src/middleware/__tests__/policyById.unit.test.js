import { getMockClients } from "../../test-utils/mocks/clients";
import { getMockPolicies } from "../../test-utils/mocks/policies";
import policyById from "../policyById";

describe("Middleware - policyById", () => {
	const policies = getMockPolicies();

	const adminClient = getMockClients({ index: 0 });
	const userClient = getMockClients({ index: 1 });

	const mockRes = {
		status: jest.fn(() => mockRes),
		json: jest.fn(() => mockRes),
	};
	const mockNext = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("adds policy to req when admin client searches for a policy", () => {
		const mockReq = {
			params: { id: policies[0].id },
			client: adminClient,
			policies,
		};

		policyById(mockReq, mockRes, mockNext);

		expect(mockReq.policyById.id).toBe(policies[0].id);

		expect(mockRes.status).not.toHaveBeenCalled();

		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("adds policy to req when user client searches for a policy of their own", () => {
		const mockReq = {
			params: { id: policies[0].id },
			client: userClient,
			policies,
		};

		policyById(mockReq, mockRes, mockNext);

		expect(mockReq.policyById.id).toBe(policies[0].id);

		expect(mockRes.status).not.toHaveBeenCalled();

		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("responds with forbidden status when user client searches for a policy of another client", () => {
		const mockReq = {
			params: { id: policies[1].id },
			client: userClient,
			policies,
		};

		policyById(mockReq, mockRes, mockNext);

		expect(mockReq.policyById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(403);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(403);
		expect(mockRes.json.mock.calls[0][0].message).toBe("Forbidden");

		expect(mockNext).not.toHaveBeenCalled();
	});

	test("responds with not found status when the policy doesn't exist", () => {
		const mockReq = {
			params: { id: "some random id" },
			client: adminClient,
			policies,
		};

		policyById(mockReq, mockRes, mockNext);

		expect(mockReq.policyById).toBeUndefined();

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(404);

		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(404);
		expect(mockRes.json.mock.calls[0][0].message).toBe("Policy not found");

		expect(mockNext).not.toHaveBeenCalled();
	});
});
