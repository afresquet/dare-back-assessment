const getClientPolicies = (client, policies) =>
	policies.filter(policy => client.id === policy.clientId);

export default getClientPolicies;
