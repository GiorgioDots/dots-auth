# Svelte

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# DB Migrations

After editing the [schema]('./src/lib/server/db/schema.ts), run the following commands to update the database:

## Create migration

```bash
npm run db:generate
```

## Execute migration
```bash
npm run db:migrate
```

# How to use

## Generate code challenge and code verifier:

```typescript
function generateCodeVerifier() {
	const array = new Uint8Array(32);
	window.crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

async function generateCodeChallenge(codeVerifier: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}
```

## Generate a state

```typescript
function generateState() {
	const array = new Uint8Array(16);
	window.crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, ''); // Base64-URL encoding
}
```

## Redirect to auth server

**Before redirect**, save the `state` and `code_verifier` in sessionStorage.

Then redirect the user to an uri like this: `{{auth_url}}/oauth/authorize?client_id={{client_id}}&redirect_uri={{app_url}}/{{some_path}}&code_challenge={{code_challenge}}&state={{state}}`

## Server response

The auth server will redirect to the `redirect_uri` with those query params:

- **code**: The code to use to fetch the bearer token
- **state**: The state previously sent (check with the one saved in the sessionStorage to prevent CSRF attacs)

## Token call

Before continue, retrieve the `code_verifier` saved in sessionStorage.

Execute the following http request to fetch the Bearer Token:

```curl
curl --location '{{auth_url}}/oauth/token' \
--header 'Content-Type: application/json' \
--data '{
    "code": "{{code}}",
    "code_verifier": "{{code_verifier}}",
    "grant_type": "token"
}'
```

## Refresh token

Execute the following http request to refresh the token:

```curl
curl --location '{{auth_url}}/oauth/token' \
--header 'Content-Type: application/json' \
--data '{
    "refresh_token": "{{refresh_token}}",
    "grant_type": "refresh_token"
}'
```
