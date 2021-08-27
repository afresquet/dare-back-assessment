import axios from "axios";
import jwt from "jsonwebtoken";
import delay from "../../../test-utils/delay";
import tokenAPI from "../tokenAPI";

jest.mock("axios");

describe("Middleware - tokenAPI", () => {
	const mockRes = {};
	const mockNext = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("fetches the token", async () => {
		const token = jwt.sign({}, "secret", { expiresIn: "1d" });

		axios.post.mockImplementationOnce(async => ({
			data: { type: "Bearer", token },
		}));

		const mockReq = {};

		const middleware = tokenAPI();
		await middleware(mockReq, mockRes, mockNext);

		expect(axios.post).toHaveBeenCalledTimes(1);

		expect(mockReq.token).toBe(`Bearer ${token}`);

		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	test("doesn't renew the token if it hasn't expired", async () => {
		const token = jwt.sign({}, "secret", { expiresIn: "1d" });

		axios.post.mockImplementationOnce(async => ({
			data: { type: "Bearer", token },
		}));

		const mockReq = {};

		const middleware = tokenAPI();
		await middleware(mockReq, mockRes, mockNext);
		await middleware(mockReq, mockRes, mockNext);

		expect(axios.post).toHaveBeenCalledTimes(1);

		expect(mockReq.token).toBe(`Bearer ${token}`);

		expect(mockNext).toHaveBeenCalledTimes(2);
	});

	test("renews expired token", async () => {
		const token = jwt.sign({}, "secret", { expiresIn: "1s" });

		axios.post.mockImplementationOnce(async => ({
			data: { type: "Bearer", token },
		}));

		const mockReq = {};

		const middleware = tokenAPI();
		await middleware(mockReq, mockRes, mockNext);

		expect(axios.post).toHaveBeenCalledTimes(1);

		expect(mockReq.token).toBe(`Bearer ${token}`);

		expect(mockNext).toHaveBeenCalledTimes(1);

		const newToken = jwt.sign({}, "secret", { expiresIn: "1d" });

		axios.post.mockImplementationOnce(async => ({
			data: { type: "Bearer", token: newToken },
		}));

		await delay(1000);
		await middleware(mockReq, mockRes, mockNext);

		expect(axios.post).toHaveBeenCalledTimes(2);

		expect(mockReq.token).toBe(`Bearer ${newToken}`);

		expect(mockNext).toHaveBeenCalledTimes(2);
	});
});
