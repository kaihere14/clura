
# 🔐 Clura

Clura is a self-hosted OAuth 2.0 / OpenID Connect identity provider. Developers register their applications on the Clura dashboard, then send their end-users to Clura's hosted login page. After the user authenticates via **Google**, **GitHub**, or **Email**, Clura issues signed **ID tokens**, **access tokens**, and **refresh tokens** (RS256) — all verifiable using Clura's public JWKS endpoint, with no proprietary SDK required.

Think of it as a self-hosted Clerk or Auth0: you own the infrastructure, the RSA keys, and the data. No vendor lock-in, no subscriptions, and no black boxes.

---
## 🛠️ How it works

1. Developer registers an app on the Clura dashboard
         ↓
2. Developer sends their user to:
   `https://<clura>/user-login/<appClientId>`
         ↓
3. Clura checks for an existing SSO session (via secure cookie)
         ↓
4. User authenticates with Google, GitHub, or Email/Password (if no active session)
         ↓
5. Clura issues a short-lived **authorization code** (valid for 2 minutes) and sets an SSO cookie
         ↓
6. Clura redirects to your app's `redirectUri` with the `code` parameter
         ↓
7. Developer exchanges the `code` + `app_secret` for tokens at the `/v1/global-auth/token` endpoint
         ↓
8. Developer verifies tokens using Clura's JWKS public key
## 🚀 Quickstart

### Step 1 — Sign in to the Clura dashboard

Visit the Clura dashboard and sign in with Google, GitHub, or your Email. This creates your developer account.

### Step 2 — Create an application

In the dashboard, click **New app** and enter:

- **Name** — a display name for your app
- **Redirect URI** — the URL in your app that Clura will redirect to after login (e.g. `https://yourapp.com/callback`)

After creation you will receive three values — copy them immediately, the secret is shown only once:

| Value         | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `appClientId` | Public identifier — safe to embed in URLs                            |
| `appSecret`   | Private secret — store server-side only, never expose to the browser |
| `redirectUri` | The callback URL you configured                                      |

### Step 3 — Send users to Clura's login page

Redirect your users to:


https://<clura-host>/user-login/<appClientId>


After the user signs in, Clura redirects them to your `redirectUri` with a `code` parameter:


https://yourapp.com/callback?code=<auth_code>


### Step 4 — Exchange code for tokens

Exchange the authorization code for tokens using your `appSecret` via a server-side POST request to `/v1/global-auth/token`.

ts
// Node.js / Express example
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  const response = await fetch("https://<clura-host>/v1/global-auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      app_secret: process.env.CLURA_APP_SECRET
    })
  });

  const { id_token, access_token, refresh_token } = await response.json();
  // Store tokens securely...
});


### Step 5 — Verify tokens

Tokens are RS256-signed JWTs. Verify them using Clura's public JWKS endpoint.

bash
npm install jwks-rsa jsonwebtoken


ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://<clura-host>/.well-known/jwks.json",
  cache: true,
  rateLimit: true,
});

async function verifyAccessToken(token: string) {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  const key = await client.getSigningKey(decoded.header.kid);

  return jwt.verify(token, key.getPublicKey(), {
    algorithms: ["RS256"],
    issuer: "https://<clura-host>",
  });
}


The verified payload contains:

ts
{
  sub: "uuid-of-user",        // stable unique user ID
  app_client_id: "uuid",      // your app's client ID
  sid: "uuid-of-session",     // session ID
  iss: "https://<clura-host>",
  iat: 1234567890,
  exp: 1234567890
}

## Protecting routes

### Express middleware

```ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://<clura-host>/.well-known/jwks.json",
  cache: true,
});

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.decode(token, { complete: true });
    const key = await client.getSigningKey(decoded.header.kid);
    req.user = jwt.verify(token, key.getPublicKey(), {
      algorithms: ["RS256"],
      issuer: "https://<clura-host>",
    });
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Usage
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ userId: req.user.sub });
});
```

### Next.js middleware

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWKS = jose.createRemoteJWKSet(new URL("https://<clura-host>/.well-known/jwks.json"));

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jose.jwtVerify(token, JWKS, {
      issuer: "https://<clura-host>",
    });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

Install `jose` for Next.js edge-compatible JWT verification:

```bash
npm install jose
```

---

## Refresh tokens

Access tokens expire after **15 minutes**. Use the refresh token to obtain a new token set without re-authenticating the user.

**Important:** The `appSecret` is required on every refresh request. A stolen refresh token alone is not sufficient to rotate it.

**Request:**

```http
POST https://<clura-host>/v1/global-auth/refresh
Content-Type: application/json

{
  "refresh_token": "64-char-hex-string",
  "app_client_id": "your-app-client-id",
  "app_secret": "your-app-secret"
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

Each refresh call invalidates the old refresh token and issues a new one (rotation). Store the new `refresh_token` immediately.

### Auto-refresh example

```ts
async function refreshTokens(refreshToken: string) {
  const res = await fetch("https://<clura-host>/v1/global-auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refreshToken,
      app_client_id: process.env.CLURA_APP_CLIENT_ID,
      app_secret: process.env.CLURA_APP_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error("Session expired — re-authentication required");
  }

  return res.json() as Promise<{
    id_token: string;
    access_token: string;
    refresh_token: string;
  }>;
}
```

---

## 🔑 Token reference

### Authorization Code

- **Format:** Opaque 64-char hex string
- **Expiry:** 2 minutes
- **Purpose:** Short-lived code exchanged for a full token set. Single-use only.

### ID Token

- **Algorithm:** RS256
- **Expiry:** 1 hour
- **Purpose:** Verify user identity once after login. Contains profile data.


{
  "sub": "uuid-of-user",
  "email": "user@example.com",
  "name": "Jane Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "https://<clura-host>",
  "iat": 1234567890,
  "exp": 1234567890
}


### Access Token

- **Algorithm:** RS256
- **Expiry:** 15 minutes
- **Purpose:** Authenticate API requests. Send as `Authorization: Bearer <token>`.


{
  "sub": "uuid-of-user",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "https://<clura-host>",
  "iat": 1234567890,
  "exp": 1234567890
}


### Refresh Token

- **Format:** Opaque 64-char hex string (not a JWT)
- **Expiry:** 7 days
- **Purpose:** Exchange for a new token set when the access token expires
- **Storage:** Server-side only — never send to the browser, never store in localStorage
## 🔍 Discovery endpoints

### JWKS

http
GET https://<clura-host>/.well-known/jwks.json



{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "clura-1",
      "n": "0vx7agoebGcQSuu...",
      "e": "AQAB"
    }
  ]
}


### OpenID Configuration

http
GET https://<clura-host>/.well-known/openid-configuration



{
  "issuer": "https://<clura-host>",
  "authorization_endpoint": "https://<clura-host>/v1/global-auth/google",
  "token_endpoint": "https://<clura-host>/v1/global-auth/token",
  "token_refresh_endpoint": "https://<clura-host>/v1/global-auth/refresh",
  "jwks_uri": "https://<clura-host>/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "email", "profile"],
  "token_endpoint_auth_methods_supported": ["client_secret_post"],
  "claims_supported": [
    "sub",
    "email",
    "name",
    "picture",
    "app_client_id",
    "sid",
    "iss",
    "iat",
    "exp"
  ]
}

## App management API

All endpoints require `Authorization: Bearer <developer-token>` — the token you receive after signing in to the Clura dashboard.

| Method   | Endpoint                        | Description                                               |
| -------- | ------------------------------- | --------------------------------------------------------- |
| `POST`   | `/v1/app`                       | Create a new app                                          |
| `GET`    | `/v1/app`                       | List all your apps                                        |
| `GET`    | `/v1/app/:id`                   | Get a specific app                                        |
| `PATCH`  | `/v1/app/:id`                   | Update app name or redirectUri                            |
| `DELETE` | `/v1/app/:id`                   | Delete an app                                             |
| `GET`    | `/v1/app/validate/:appClientId` | Check if an appClientId exists (public, no auth required) |

**Create app:**

```http
POST /v1/app
Authorization: Bearer <developer-token>
Content-Type: application/json

{
  "name": "My App",
  "redirectUri": "https://yourapp.com/callback"
}
```

**Response:**

```json
{
  "id": "uuid",
  "appClientId": "uuid",
  "appSecret": "64-char-hex",
  "name": "My App",
  "redirectUri": "https://yourapp.com/callback",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

The `appSecret` is returned only on creation and never again.

---

## Self-hosting 🏠

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- PostgreSQL database
- Google Cloud and GitHub projects with OAuth 2.0 credentials

### 1. Clone and install

bash
git clone https://github.com/your-username/clura.git
cd clura
bun install


### 2. Generate an RSA key pair

bash
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


Copy the output — you will need both keys in the next step.

### 3. Configure the server

Create `server/.env`:

env
DATABASE_URL=postgresql://user:password@localhost:5432/clura

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/v1/auth/google/callback
GLOBAL_REDIRECT_URI=http://localhost:8000/v1/global-auth/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_UI=http://localhost:8000/v1/auth/github/callback

GLOBAL_GITHUB_CLIENT_ID=your_global_github_client_id
GLOBAL_GITHUB_CLIENT_SECRET=your_global_github_client_secret
GLOBAL_GITHUB_REDIRECT_URI=http://localhost:8000/v1/global-auth/github/callback

JWT_SECRET=a-long-random-string-for-developer-sessions

JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
JWT_KEY_ID=clura-1
JWT_ISSUER=http://localhost:8000

FRONTEND_URL=http://localhost:3000
SSO_COOKIE_DOMAIN=localhost


### 4. Configure the client

Create `client/.env.local`:

env
NEXT_PUBLIC_API_URL=http://localhost:8000


### 5. Run database migrations

bash
cd server
bunx drizzle-kit generate
bunx drizzle-kit migrate


### 6. Add redirect URIs in Provider Consoles

Add these to your Google Cloud and GitHub OAuth app's **Authorized redirect URIs**:

- `http://localhost:8000/v1/auth/google/callback`
- `http://localhost:8000/v1/global-auth/callback`
- `http://localhost:8000/v1/auth/github/callback`
- `http://localhost:8000/v1/global-auth/github/callback`

### 7. Start

bash
bun run dev:server    # API on port 8000
bun run dev:client    # Dashboard on port 3000
bun run dev:test      # Test app on port 4000

## 📂 Project structure


clura/
├── client/                  # Next.js frontend (landing, docs + dashboard)
│   ├── app/
│   │   ├── page.tsx          # Landing page entry, now uses responsive width (md:w-full) for mobile screens
│   │   ├── dashboard/       # Developer dashboard
│   │   ├── docs/            # Documentation page
│   │   ├── login/           # Developer login
│   │   ├── auth/            # OAuth callback handlers
│   │   └── user-login/[id]/ # End-user login page
│   ├── components/
│   │   ├── dashboard/       # AppCard, CreateAppModal, SecretRevealModal
│   │   ├── landing/         # Hero, Features, CTA, OpenSource components
│   │   ├── login/           # LoginHeader, SocialLogins, EmailLoginForm
│   │   ├── trusted-by/      # Trusted companies section
│   │   └── ui/              # Globe and UI primitives (Aceternity)
│   ├── data/                # Globe visualization data
│   ├── store/
│   │   └── authStore.ts     # Zustand auth store
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


---
## 🗄️ Database schema

### `client_table` — Developer accounts

| Column          | Type      | Description           |
| --------------- | --------- | --------------------- |
| `id`            | uuid PK   | Developer ID          |
| `google_id`     | varchar   | Google OAuth sub (opt)|
| `github_id`     | varchar   | GitHub OAuth ID (opt) |
| `name`          | varchar   | Display name          |
| `email`         | varchar   | Email address         |
| `avatar`        | varchar   | Profile picture URL   |
| `password_hash` | text      | Hashed password (opt) |
| `created_at`    | timestamp | Account creation time |

### `app_table` — Registered applications

| Column          | Type          | Description                         |
| --------------- | ------------- | ----------------------------------- |
| `id`            | uuid PK       | Internal app ID                     |
| `client_id`     | uuid FK       | Owner developer                     |
| `name`          | varchar       | App display name                    |
| `app_client_id` | uuid          | Public client identifier            |
| `app_secret`    | varchar(64)   | Secret for refresh token validation |
| `redirect_uri`  | varchar(2048) | Post-login redirect URL             |
| `created_at`    | timestamp     | Registration time                   |

### `user_table` — End-users

| Column          | Type      | Description                             |
| --------------- | --------- | --------------------------------------- |
| `id`            | uuid PK   | User ID — the `sub` claim in all tokens |
| `google_id`     | varchar   | Google OAuth sub (opt)                  |
| `github_id`     | varchar   | GitHub OAuth ID (opt)                   |
| `name`          | varchar   | Display name                            |
| `email`         | varchar   | Email address                           |
| `avatar`        | varchar   | Profile picture URL                     |
| `password_hash` | text      | Hashed password (opt)                   |
| `created_at`    | timestamp | First login time                        |

### `session_table` — Active sessions

| Column          | Type         | Description                            |
| --------------- | ------------ | -------------------------------------- |
| `id`            | uuid PK      | Session ID — the `sid` claim in tokens |
| `user_id`       | uuid FK      | End-user                               |
| `app_client_id` | uuid FK      | App the session belongs to             |
| `refresh_token` | varchar(128) | SHA-256 hash of the raw token          |
| `created_at`    | timestamp    | Session creation time                  |
| `expires_at`    | timestamp    | 7-day expiry                           |

### `sso_session_table` — Global SSO sessions

| Column       | Type        | Description                   |
| ------------ | ----------- | ----------------------------- |
| `id`         | uuid PK     | Internal ID                   |
| `user_id`    | uuid FK     | End-user                      |
| `token`      | varchar(64) | SHA-256 hash of the SSO token |
| `created_at` | timestamp   | Session creation time         |
| `expires_at` | timestamp   | 7-day expiry                  |

### `auth_code_table` — Temporary authorization codes

| Column          | Type         | Description                               |
| --------------- | ------------ | ----------------------------------------- |
| `id`            | uuid PK      | Internal ID                               |
| `code`          | varchar(64)  | The authorization code sent to the client |
| `app_client_id` | uuid FK      | App the code belongs to                   |
| `id_token`      | varchar      | Pre-generated ID token                    |
| `access_token`  | varchar      | Pre-generated access token                |
| `refresh_token` | varchar(64)  | Raw refresh token                         |
| `expires_at`    | timestamp    | 2-minute expiry                           |
| `used`          | boolean      | Whether the code has been exchanged       |
## 💻 Stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Runtime        | Bun                                            |
| Server         | Express 5 + TypeScript                         |
| Client         | Next.js (App Router) + React 19                |
| UI & Animation | Tailwind CSS 4, Aceternity UI, Three.js, Motion, tsParticles |
| Database       | PostgreSQL + Drizzle ORM                       |
| Auth           | Google OAuth 2.0 + RS256 JWT                   |
| Analytics      | Vercel Analytics                               |

---
## Security notes

- `appSecret` is displayed once at creation — store it in your server's environment variables and never commit it
- Refresh tokens are stored as SHA-256 hashes — the raw token is never persisted to the database
- Refresh token rotation is enforced on every use — each call invalidates the old token
- `appSecret` is required on every refresh request — a stolen refresh token alone cannot be used to rotate without it
- Access tokens are short-lived (15 min) — a leaked access token has a narrow window of exposure
- All tokens are signed with an RSA private key that never leaves the Clura server
