# smart-shopping-lister

This app lets you create and save shopping lists for making it easier for you to remember what to buy the next time you go shopping. With the smart feature turned on, you can use AI generated shopping suggestions to help you pick your next item.

## Setup

Use Node.js 26.13.1 (LTS) and npm 12.2.2. With nvm installed:

```bash
nvm install
nvm use
npm install --global npm@12.2.2
npm ci
```

The Node.js major version is also declared in `package.json` for Vercel builds.

## Authentication and environment

The app uses Better Auth with Auth0 (OpenID Connect) and the existing MongoDB database.
Copy `.env.example` to `.env` and fill in your own values. Never commit credentials.

- `MONGODB_URI`: the existing database connection string. Better Auth uses separate
  `auth_user`, `auth_session`, `auth_account`, and `auth_verification` collections.
  Existing shopping lists and items are not migrated or renamed.
- `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET`: the existing Auth0 application credentials.
- `AUTH0_ISSUER`: your Auth0 tenant origin, including `https://`. When omitted,
  the existing tenant configured by this project is used.
- `BETTER_AUTH_SECRET`: a random secret of at least 32 characters. Generate one
  with `openssl rand -base64 32`. Existing deployments can continue using
  `SVELTE_AUTH_CONFIG_SECRET` as a fallback during migration.
- `BETTER_AUTH_URL`: set to `http://localhost:5173` locally and
  `https://smart-shopping-lister.vercel.app` for production. Configure preview
  environments with their own origin when testing Auth0 login.
- `HUGGINGFACE_API_KEY`: used by the separate shopping-suggestion endpoint.

Auth endpoints remain under `/auth`, preserving these Auth0 Allowed Callback URLs:

```text
http://localhost:5173/auth/callback/auth0
https://smart-shopping-lister.vercel.app/auth/callback/auth0
```

Keep the corresponding app origins in Auth0's Allowed Web Origins. Session
cookies are new, so users must sign in again after deployment. Lists remain
associated with the same Auth0 email address. Sign-out clears the app session;
it does not sign out of Auth0 globally.

The MongoDB user needs permission to create/read/write the auth collections and
create their indexes. The MongoDB adapter creates the required indexes; there is
no SQL migration to run. The shared database connection is opened lazily, so
public pages can render without a database connection.

## Validation

```bash
npm run check
npm run lint
npm run test:unit -- --run
npm run build
npm audit
```

The auth tests use an isolated memory adapter and a mocked OIDC issuer with
signed test ID tokens; they never access real Auth0 accounts or production data.

## Building

To create a production version of your app:

```bash
npm run build
```

## Running

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Local app runs on: `http://localhost:5173/`
