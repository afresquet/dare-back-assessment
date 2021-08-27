# DARE Back Assessment

## Requirements

- NodeJS v14.17.5 (current LTS release as of 24/08/2021)
- NPM v5 or above
- A text editor with the Prettier plugin installed

## Project setup

### Cloning repository

```
git clone https://github.com/afresquet/dare-back-assessment.git
cd dare-back-assessment
```

### Setting environment variables

Complete a `.env` file with the required variables, you can find them in the `.env.example` file.

### Installing dependencies

```
npm install
```

### Building

```
npm run compile
```

### Running

```
npm start
```

### Running tests

```
npm test
```

## Endpoints

Use curl or Postman to access the following endpoints.

The domain should be `localhost:XXXX` where `XXXX` is the port you specified in the `.env` file (or 5000 by default).

### POST /api/v1/login

Request body

```json
{
	"username": "your username",
	"password": "your password"
}
```

Response body

```json
{
	"type": "Bearer",
	"token": "your.jwt.token",
	"expires_in": 3600
}
```

Username must be an email from any client (e.g. `britneyblankenship@quotezart.com`, `manningblankenship@quotezart.com`, `barnettblankenship@quotezart.com`).

Password can be anything, as I wasn't sure how to handle passwords with the provided data, and with the specifications not including a `/signup` endpoint.

Returns the Bearer token both in the response body as in the response headers.

### GET /api/v1/clients

Request query

```json
{
	"limit": 10, // optional, 10 by default
	"name": "name" // optional
}
```

Response body

```json
[
	{
		"id": "string",
		"name": "string",
		"email": "string",
		"role": "string",
		"policies": [
			{
				"id": "string",
				"amountInsured": "string",
				"inceptionDate": "string"
			}
		]
	}
	/* ... */
]
```

Returns an array of clients.

A client with the user role can only retrieve their own details.

A client with the admin role can retrieve all clients.

### GET /api/v1/clients/:id

Request params

```json
{
	"id": "client_id"
}
```

Response body

```json
[
	{
		"id": "string",
		"name": "string",
		"email": "string",
		"role": "string",
		"policies": [
			{
				"id": "string",
				"amountInsured": "string",
				"inceptionDate": "string"
			}
		]
	}
]
```

Returns the client details that belong to the specified id.

A client with the user role can only retrieve their own details.

A client with the admin role can retrieve any clients.

### GET /api/v1/clients/:id/policies

Request params

```json
{
	"id": "client_id"
}
```

Response body

```json
[
	{
		"id": "string",
		"amountInsured": "string",
		"email": "string",
		"inceptionDate": "string",
		"installmentPayment": true
	}
	/* ... */
]
```

Returns the policies of client that belong to the specified id.

A client with the user role can only retrieve their own policies.

A client with the admin role can retrieve the policies of any client.

### GET /api/v1/policies

Request query

```json
{
	"limit": 10 // optional, 10 by default
}
```

Response body

```json
[
	{
		"id": "string",
		"amountInsured": "string",
		"email": "string",
		"inceptionDate": "string",
		"installmentPayment": true
	}
	/* ... */
]
```

Returns an array of policies.

A client with the user role can only retrieve their own policies.

A client with the admin role can retrieve all policies.

### GET /api/v1/policies/:id

Request params

```json
{
	"id": "policy_id"
}
```

Response body

```json
[
	{
		"id": "string",
		"amountInsured": "string",
		"email": "string",
		"inceptionDate": "string",
		"installmentPayment": true
	}
]
```

Returns the policy that belongs to the passed id.

A client with the user role can only retrieve a policy of their own.

A client with the admin role can retrieve any policy.
