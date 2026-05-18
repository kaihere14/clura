# 🔐 Clura

Clura is a self-hosted OAuth 2.0 / OpenID Connect identity provider. Developers register applications via the dashboard, then direct users to Clura's hosted login page. After authentication via **Google**, **GitHub**, or **Email**, Clura issues RS256-signed **ID tokens**, **access tokens**, and **refresh tokens** verifiable via a public JWKS endpoint.

Think of it as a self-hosted Clerk or Auth0: you own the infrastructure, RSA keys, and data. No vendor lock-in, no subscriptions, and no black boxes.

---

## 🛠️ Authentication Flow

1. Developer registers an app on the Clura dashboard  
2. Redirect user to: `https://<clura>/user-login/<appClientId>`  
3. Clura checks for an active SSO session  
4. User authenticates via Google, GitHub, or Email/Password  
5. Clura issues a short-lived **authorization code** (2-minute expiry) and sets an SSO cookie  
6. User is redirected to the app's `redirectUri` with the `code` parameter  
7. Developer exchanges `code` + `app_secret` for tokens at `/v1/global-auth/token`  
8. Developer verifies tokens using Clura's JWKS public key  

---

## 🚀 Getting Started

### 1. Create an Application
In the dashboard:
- **Name**: Display name for your app  
- **Redirect URI**: Callback URL (e.g., `https://yourapp.com/callback`)  

You'll receive:
| Value         | Description                          |
|---------------|--------------------------------------|
| `appClientId` | Public identifier (safe to embed)    |
| `appSecret`   | Private secret (store server-side)   |
| `redirectUri` | Configured callback URL              |

### 2. Redirect Users to Login
```http
GET https://<clura-host>/user-login/<appClientId>
```

### 3. Exchange Code for Tokens
```ts
// Node.js example
const response = await fetch("https://<clura-host>/v1/global-auth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code,
    app_secret: process.env.CLURA_APP_SECRET
  })
});
```

### 4. Verify Tokens
```ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://<clura-host>/.well-known/jwks.json",
  cache: true
});

async function verifyToken(token) {
  const decoded = jwt.decode(token, { complete: true });
  const key = await client.getSigningKey(decoded.header.kid);
  return jwt.verify(token, key.getPublicKey(), {
    algorithms: ["RS256"],
    issuer: "https://<clura-host>"
  });
}
```

---

## 🔑 Token Reference

| Type           | Expiry  | Purpose                                  | Format         |
|----------------|---------|------------------------------------------|----------------|
| **Authorization Code** | 2 mins  | Short-lived code for token exchange      | 64-char hex    |
| **ID Token**     | 1 hour  | Verify user identity after login         | RS256 JWT      |
| **Access Token** | 15 mins | Authenticate API requests                | RS256 JWT      |
| **Refresh Token**| 7 days  | Obtain new tokens without re-authenticating | Opaque string |

**ID Token Claims**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "app_client_id": "app-uuid",
  "iss": "https://<clura-host>"
}
```

**Access Token Claims**:
```json
{
  "sub": "user-uuid",
  "app_client_id": "app-uuid",
  "iss": "https://<clura-host>"
}
```

---

## 🔁 Refresh Tokens

**Request**:
```http
POST https://<clura-host>/v1/global-auth/refresh
Content-Type: application/json

{
  "refresh_token": "64-char-hex",
  "app_client_id": "your-app-client-id",
  "app_secret": "your-app-secret"
}
```

**Response**:
```json
{
  "id_token": "eyJ...",
  "access_token": "eyJ...",
  "refresh_token": "new-64-char-hex"
}
```

**Security**:
- Requires `appSecret` on every request
- Refresh tokens are rotated on each use
- Stored as SHA-256 hashes in the database

---

## 🌐 Discovery Endpoints

### JWKS
```http
GET https://<clura-host>/.well-known/jwks.json
```

**Response**:
```json
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
```

### OpenID Configuration
```http
GET https://<clura-host>/.well-known/openid-configuration
```

**Response**:
```json
{
  "issuer": "https://<clura-host>",
  "token_endpoint": "https://<clura-host>/v1/global-auth/token",
  "jwks_uri": "https://<clura-host>/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"]
}
```

---

## 🧰 App Management API

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| `POST` | `/v1/app`                       | Create a new app                |
| `GET`  | `/v1/app`                       | List all apps                   |
| `GET`  | `/v1/app/:id`                   | Get app details                 |
| `PATCH`| `/v1/app/:id`                   | Update app name/redirect URI    |
| `DELETE`| `/v1/app/:id`                  | Delete an app                   |

**Create App Example**:
```http
POST /v1/app
Authorization: Bearer <developer-token>
Content-Type: application/json

{
  "name": "My App",
  "redirectUri": "https://yourapp.com/callback"
}
```

---

## 🏠 Self-Hosting

### Prerequisites
- [Bun](https://bun.sh) v1.3+
- PostgreSQL database
- Google & GitHub OAuth credentials

### 1. Clone & Install
```bash
git clone https://github.com/your-username/clura.git
cd clura
bun install
```

### 2. Generate RSA Keys
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

### 3. Configure Environment
Create `server/.env` with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clura
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
JWT_KEY_ID=clura-1
JWT_ISSUER=http://localhost:8000
```

### 4. Run Migrations
```bash
cd server
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 5. Start Services
```bash
bun run dev:server    # API on port 8000
bun run dev:client    # Dashboard on port 3000
bun run dev:test      # Test app on port 4000
```

---

## 🔐 Security Best Practices

- Store `appSecret` in server-side environment variables
- Never expose refresh tokens to clients
- Use HTTPS for all endpoints
- Rotate RSA keys periodically
- Monitor for unauthorized access attempts

---

## 📦 Project Structure

```
clura/
├── client/       # Next.js frontend (dashboard, auth)
├── server/       # Express backend (API, auth logic)
├── test/         # Test app (simulates developer app)
└── db/           # Drizzle ORM schema and migrations
```

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Runtime   | Bun                                 |
| Server    | Express + TypeScript                |
| Client    | Next.js (App Router) + React        |
| Database  | PostgreSQL + Drizzle ORM            |
| Auth      | OAuth 2.0, RS256 JWT                |
| UI        | Tailwind CSS, Aceternity UI         |

---

## 📚 License

MIT License. See [LICENSE](LICENSE) for details.