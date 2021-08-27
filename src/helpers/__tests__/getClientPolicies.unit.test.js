import { getMockClients } from "../../../test-utils/mocks/clients";
import { getMockPolicies } from "../../../test-utils/mocks/policies";
import getClientPolicies from "../getClientPolicies";

describe("Helpers - getClientPolicies", () => {
	const client = getMockClients({ index: 0 });
	const policies = getMockPolicies({ limit: 10 });

	describe("getUserPolicies", () => {
		const expected = policies.filter(policy => policy.clientId === client.id);
		const result = getClientPolicies(client, policies);

		test("returns policies for the specified client", () => {
			expect(result).toHaveLength(expected.length);
		});

		test("removes the parameters clientId, email and installmentPayment", () => {
			const valid = result.every(
				policy =>
					policy.clientId === undefined &&
					policy.email === undefined &&
					policy.installmentPayment === undefined
			);

			expect(valid).toBe(true);
		});

		test("returns policies with metadata if specified", () => {
			const resultWithMetadata = getClientPolicies(client, policies, true);

			expect(resultWithMetadata).toHaveLength(expected.length);

			const valid = resultWithMetadata.every(
				policy =>
					policy.clientId === undefined &&
					policy.email !== undefined &&
					policy.installmentPayment !== undefined
			);

			expect(valid).toBe(true);
		});
	});
});
