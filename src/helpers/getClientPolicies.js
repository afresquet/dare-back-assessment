const getClientPolicies = (client, policies, metadata = false) => {
	let result = policies.filter(policy => client.id === policy.clientId);

	if (metadata) {
		result = result.map(({ clientId, ...policy }) => policy);
	} else {
		result = result.map(
			({ clientId, email, installmentPayment, ...policy }) => policy
		);
	}

	return result;
};

export default getClientPolicies;
