import { getMockClients } from "../../test-utils/mocks/clients";
import { getMockPolicies } from "../../test-utils/mocks/policies";
import getUserPolicies from "../getUserPolicies";

describe("Helpers - getUserPolicies", () => {
	const client = getMockClients({ index: 0 });
	const policies = getMockPolicies({ limit: 10 });

	const result = getUserPolicies(client, policies);

	test("returns policies for the specified client", () => {
		expect(result).toHaveLength(6);

		const allFromClient = result.every(policy => policy.clientId === client.id);

		expect(allFromClient).toBe(true);
	});
});
