# Clura

Clura is a self-hosted OAuth 2.0 / OpenID Connect identity provider — similar to Auth0 or Clerk but fully under your control. Developers register their apps on Clura, and their end-users authenticate through Clura's login page. After login, Clura issues signed JWT tokens that developers verify using Clura's public JWKS endpoint.

---

## How It Works

```
Developer registers app on Clura dashboard
        ↓
End-user visits /user-login/:appClientId
        ↓
Clura handles Google OAuth
        ↓
Clura issues ID token + access token + refresh token
        ↓
Redirects to app's redirectUri with all three tokens
        ↓
Developer verifies tokens using Clura's public key (JWKS)
```

---

## Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Runtime  | Bun                                |
| Server   | Express 5 + TypeScript             |
| Client   | Next.js 16 (App Router) + React 19 |
| Database | PostgreSQL + Drizzle ORM           |
| Auth     | Google OAuth 2.0 + RS256 JWT       |
| Styling  | Tailwind CSS 4                     |

---

## Project Structure

```
clura/
├── client/                  # Next.js frontend (dashboard + login pages)
│   ├── app/
│   │   ├── dashboard/       # Developer dashboard (app management)
│   │   ├── login/           # Developer login
│   │   ├── auth/callback/   # OAuth callback handler
│   │   └── user-login/[id]/ # End-user login page
│   ├── components/
│   │   ├── dashboard/       # AppCard, CreateAppModal, SecretRevealModal, etc.
│   │   └── login/           # LoginHeader, SocialLogins, EmailLoginForm
│   ├── store/
│   │   └── authStore.ts     # Zustand auth store (token + user)
│   └── lib/
│       └── api.ts           # API client helpers
├── server/                  # Express backend
│   └── src/
│       ├── app/
│       │   ├── auth/            # Developer OAuth (Google)
│       │   ├── global-auth/     # End-user OAuth + token issuance
│       │   ├── application/     # App CRUD
│       │   └── well-known/      # JWKS + OpenID configuration
│       └── db/
│           ├── schema.ts        # Drizzle schema
│           └── index.ts         # DB client
└── test/
    └── server.ts            # Test app (port 4000) to simulate a developer's app
```

---

## Database Schema

### `client_table` — Developer accounts

| Column     | Type      | Description           |
| ---------- | --------- | --------------------- |
| id         | uuid PK   | Developer ID          |
| google_id  | varchar   | Google OAuth sub      |
| name       | varchar   | Display name          |
| email      | varchar   | Email address         |
| avatar     | varchar   | Profile picture URL   |
| created_at | timestamp | Account creation time |

### `app_table` — Registered applications

| Column        | Type          | Description                         |
| ------------- | ------------- | ----------------------------------- |
| id            | uuid PK       | Internal app ID                     |
| client_id     | uuid FK       | Owner (developer)                   |
| name          | varchar       | App display name                    |
| app_client_id | uuid          | Public client identifier            |
| app_secret    | varchar(64)   | Secret for refresh token validation |
| redirect_uri  | varchar(2048) | Where to redirect after login       |
| created_at    | timestamp     | Registration time                   |

### `user_table` — End-users (global)

| Column     | Type      | Description               |
| ---------- | --------- | ------------------------- |
| id         | uuid PK   | User ID (`sub` in tokens) |
| google_id  | varchar   | Google OAuth sub          |
| name       | varchar   | Display name              |
| email      | varchar   | Email address             |
| avatar     | varchar   | Profile picture URL       |
| created_at | timestamp | First login time          |

### `session_table` — Active sessions

| Column        | Type         | Description                           |
| ------------- | ------------ | ------------------------------------- |
| id            | uuid PK      | Session ID (`sid` in tokens)          |
| user_id       | uuid FK      | End-user                              |
| app_client_id | uuid FK      | App the session belongs to            |
| refresh_token | varchar(128) | SHA-256 hash of the raw refresh token |
| created_at    | timestamp    | Session creation time                 |
| expires_at    | timestamp    | Session expiry (7 days)               |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- PostgreSQL database
- Google Cloud project with OAuth 2.0 credentials

### 1. Clone and install

```bash
git clone https://github.com/your-username/clura.git
cd clura
bun install
```

### 2. Configure the server

Create `server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/clura

# Google OAuth (for developer login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/v1/auth/google/callback

# Google OAuth (for end-user login — add this URI in Google Console too)
GLOBAL_REDIRECT_URI=http://localhost:8000/v1/global-auth/callback

# Developer JWT (symmetric, for dashboard sessions)
JWT_SECRET=your_long_random_secret

# RS256 key pair (for end-user ID tokens and access tokens)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
JWT_KEY_ID=clura-1
JWT_ISSUER=http://localhost:8000

FRONTEND_URL=http://localhost:3000
```

Generate an RSA key pair:

```bash
node -e "
const { generateKeyPairSync } = require('crypto');
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
console.log(JSON.stringify(privateKey));
console.log(JSON.stringify(publicKey));
"
```

### 3. Configure the client

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run database migrations

```bash
cd server
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 5. Add authorized redirect URIs in Google Console

Add both of these to your Google OAuth app's authorized redirect URIs:

- `http://localhost:8000/v1/auth/google/callback` (developer login)
- `http://localhost:8000/v1/global-auth/callback` (end-user login)

### 6. Start the servers

```bash
# Developer dashboard + login (port 3000)
bun run dev:client

# API server (port 8000)
bun run dev:server

# Test app — simulates a developer's app (port 4000)
bun run dev:test
```

---

## Developer Flow

### 1. Sign up

Visit `http://localhost:3000/login` and sign in with Google. This creates your developer account.

### 2. Create an application

In the dashboard, click **New app** and fill in:

- **Name** — your app's display name
- **Redirect URI** — where Clura sends users after login (e.g. `http://localhost:4000/callback`)

On creation you receive:

- `appClientId` — public identifier, safe to expose
- `appSecret` — **shown once**, store securely server-side
- `redirectUri` — the callback URL you configured

### 3. Direct users to Clura's login page

```
http://localhost:3000/user-login/<appClientId>
```

Users see a Google login button. After authenticating, Clura redirects them to your `redirectUri`:

```
https://yourapp.com/callback?id_token=X&access_token=Y&refresh_token=Z
```

---

## Token Reference

### ID Token

- **Algorithm:** RS256
- **Expiry:** 1 hour
- **Purpose:** Verify the user's identity once after login

```json
{
  "sub": "uuid-of-user",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "http://localhost:8000",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Access Token

- **Algorithm:** RS256
- **Expiry:** 15 minutes
- **Purpose:** Authenticate API requests — send as `Authorization: Bearer <token>`

```json
{
  "sub": "uuid-of-user",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "http://localhost:8000",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Refresh Token

- **Format:** Opaque 64-char hex string (not a JWT)
- **Expiry:** 7 days
- **Purpose:** Obtain a new token set when the access token expires
- **Storage:** Server-side only — never expose in the browser

---

## API Reference

### End-User Auth

#### `GET /v1/global-auth/google?appClientId=<uuid>`

Initiates Google OAuth for an end-user. Redirects to Google consent screen.

#### `GET /v1/global-auth/callback`

Google's callback. Handled internally — upserts user, creates session, issues tokens, redirects to `redirectUri`.

#### `POST /v1/global-auth/refresh`

Exchange a refresh token for a new token set. Old refresh token is immediately invalidated (rotation).

**Request:**

```json
{
  "refresh_token": "64-char-hex",
  "app_client_id": "uuid-of-your-app",
  "app_secret": "64-char-hex-secret"
}
```

**Response:**

```json
{
  "id_token": "eyJ...",
  "access_token": "eyJ...",
  "refresh_token": "new-64-char-hex"
}
```

### Discovery Endpoints

#### `GET /.well-known/jwks.json`

Returns the RSA public key in JWKS format. Use this to verify ID tokens and access tokens.

```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "clura-1",
      "n": "...",
      "e": "AQAB"
    }
  ]
}
```

#### `GET /.well-known/openid-configuration`

OpenID Connect discovery document. OIDC-compliant libraries can auto-configure from this URL.

```json
{
  "issuer": "http://localhost:8000",
  "authorization_endpoint": "http://localhost:8000/v1/global-auth/google",
  "token_endpoint": "http://localhost:8000/v1/global-auth/refresh",
  "jwks_uri": "http://localhost:8000/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "email", "profile"]
}
```

### Developer Auth (Dashboard)

#### `GET /v1/auth/google`

Initiates Google OAuth for developer login.

#### `GET /v1/auth/me`

Returns the authenticated developer's profile. Requires `Authorization: Bearer <token>`.

### App Management (all require `Authorization: Bearer <developer-token>`)

| Method   | Endpoint                        | Description                             |
| -------- | ------------------------------- | --------------------------------------- |
| `POST`   | `/v1/app`                       | Create a new app                        |
| `GET`    | `/v1/app`                       | List all your apps                      |
| `GET`    | `/v1/app/:id`                   | Get a specific app                      |
| `PATCH`  | `/v1/app/:id`                   | Update app name or redirectUri          |
| `DELETE` | `/v1/app/:id`                   | Delete an app                           |
| `GET`    | `/v1/app/validate/:appClientId` | Check if an appClientId exists (public) |

---

## Verifying Tokens

Install a JWKS client in your backend:

```bash
npm install jwks-rsa jsonwebtoken
```

```ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "http://localhost:8000/.well-known/jwks.json",
});

export async function verifyAccessToken(token: string) {
  const decoded = jwt.decode(token, { complete: true });
  const key = await client.getSigningKey(decoded?.header.kid);

  return jwt.verify(token, key.getPublicKey(), {
    algorithms: ["RS256"],
    issuer: "http://localhost:8000",
  });
}
```

The verified payload contains `sub` (user ID), `email`, `app_client_id`, and `sid`. Use `sub` as the stable unique identifier for the user in your database.

---

## Testing

Start the test app on port 4000:

```bash
bun run dev:test
```

Create an app in the dashboard with `redirectUri = http://localhost:4000/callback`. After a user logs in, the test app at `http://localhost:4000/callback` lets you:

- Decode and inspect the ID token and access token payloads
- Test the refresh token endpoint interactively
- Fetch and view the JWKS public key
- Fetch and view the OpenID discovery document

---

## Security Notes

- `appSecret` is shown **once** at app creation and never again — store it in your server's environment variables
- Refresh tokens are stored as SHA-256 hashes in the database — the raw token is never persisted
- Refresh token rotation is enforced — each use invalidates the old token and issues a new one
- The `appSecret` is required on every refresh request, so a stolen refresh token alone is not enough to rotate it
- Access tokens are short-lived (15 min) to limit exposure if intercepted
