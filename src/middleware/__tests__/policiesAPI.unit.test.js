import axios from "axios";
import { getMockPolicies } from "../../test-utils/mocks/policies";
import policiesAPI from "../policiesAPI";
import withClients from "../withClients";

jest.mock("axios");

describe("Middleware - policiesAPI", () => {
	const policies = getMockPolicies({ limit: 5 });

	const mockRes = {
		status: jest.fn(() => mockRes),
		json: jest.fn(() => mockRes),
	};
	const mockNext = jest.fn();

	const mockResponse = {
		data: policies,
		headers: {
			etag: 'W/"AEfbepvFX2f2biqDNiA3JVwKCK4"',
			expires: new Date(Date.now() + 60 * 1000).toString(),
		},
	};

	axios.get.mockImplementation(async => mockResponse);

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("fetches the policies", async () => {
		const mockReq = { token: "Bearer token" };
		const middleware = policiesAPI();

		await middleware(mockReq, mockRes, mockNext);

		expect(mockReq.policies).toBe(policies);

		expect(axios.get).toHaveBeenCalledTimes(1);
		expect(axios.get.mock.calls[0][0]).toBe(
			"https://dare-nodejs-assessment.herokuapp.com/api/policies"
		);
		expect(axios.get.mock.calls[0][1].headers.Authorization).toBe(
			mockReq.token
		);
		expect(axios.get.mock.calls[0][1].headers["If-None-Match"]).toBe("");

		expect(mockRes.status).not.toHaveBeenCalled();
		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("doesn't fetch again if the reponse is still fresh", async () => {
		const mockReq = { token: "Bearer token" };
		const middleware = policiesAPI();

		await middleware(mockReq, mockRes, mockNext);
		await middleware(mockReq, mockRes, mockNext);

		expect(mockReq.policies).toBe(policies);

		expect(axios.get).toHaveBeenCalledTimes(1);

		expect(mockRes.status).not.toHaveBeenCalled();
		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(2);
	});

	test("doesn't update the cache if the response has status 304", async () => {
		const mockReq = { token: "Bearer token" };
		const middleware = policiesAPI();

		axios.get.mockImplementationOnce(async => ({
			...mockResponse,
			headers: {
				...mockResponse.headers,
				expires: new Date(0).toString(),
			},
		}));

		await middleware(mockReq, mockRes, mockNext);

		const fetchedPolicies = mockReq.policies;

		expect(fetchedPolicies).toBe(policies);

		axios.get.mockImplementation(async => {
			throw {
				response: {
					status: 304,
					statusMessage: "Not modified",
					headers: mockResponse.headers,
				},
			};
		});

		await middleware(mockReq, mockRes, mockNext);

		expect(mockReq.policies).toBe(fetchedPolicies);

		expect(axios.get).toHaveBeenCalledTimes(2);

		expect(mockRes.status).not.toHaveBeenCalled();
		expect(mockRes.json).not.toHaveBeenCalled();

		expect(mockNext).toHaveBeenCalledTimes(2);
	});

	test("responds with error status if an error happens", async () => {
		const mockReq = { token: "Bearer token" };
		const middleware = withClients();

		const mockErrorResponse = {
			status: 404,
			statusMessage: "Not found",
		};

		axios.get.mockImplementation(async => {
			throw {
				response: mockErrorResponse,
			};
		});

		await middleware(mockReq, mockRes, mockNext);

		expect(axios.get).toHaveBeenCalledTimes(1);

		expect(mockRes.status).toHaveBeenCalledTimes(1);
		expect(mockRes.status).toHaveBeenCalledWith(mockErrorResponse.status);
		expect(mockRes.json).toHaveBeenCalledTimes(1);
		expect(mockRes.json.mock.calls[0][0].code).toBe(mockErrorResponse.status);
		expect(mockRes.json.mock.calls[0][0].message).toBe(
			mockErrorResponse.statusMessage
		);

		expect(mockNext).toHaveBeenCalledTimes(0);
	});
});
