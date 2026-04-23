"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconBook2,
  IconChevronRight,
  IconCode,
  IconDatabase,
  IconKey,
  IconRefresh,
  IconRocket,
  IconServer2,
  IconShieldCheck,
  IconTerminal2,
} from "@tabler/icons-react";

const navSections = [
  { id: "overview", label: "Overview", icon: IconBook2 },
  { id: "how-it-works", label: "How it works", icon: IconRocket },
  { id: "quickstart", label: "Quickstart", icon: IconTerminal2 },
  { id: "protecting-routes", label: "Protecting Routes", icon: IconShieldCheck },
  { id: "refresh-tokens", label: "Refresh Tokens", icon: IconRefresh },
  { id: "token-reference", label: "Token Reference", icon: IconKey },
  { id: "api-reference", label: "API Reference", icon: IconCode },
  { id: "self-hosting", label: "Self-hosting", icon: IconServer2 },
  { id: "database-schema", label: "Database Schema", icon: IconDatabase },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%" },
    );
    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-neutral-200 dark:border-neutral-800">
        <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
          <Link
            href="/"
            className="mb-5 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <IconArrowLeft size={15} />
            Back to home
          </Link>
          <div className="flex items-center gap-2">
            <img src="/clura.png" alt="" className="size-7" />
            <span className="bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-xl font-bold text-transparent">
              Clura
            </span>
          </div>
          <p className="ml-0.5 mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Documentation
          </p>
        </div>
        <nav className="flex-1 p-4">
          {navSections.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
              className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeSection === id
                  ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-10 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
            <span>Docs</span>
            <IconChevronRight size={13} />
            <span className="capitalize text-violet-600 dark:text-violet-400">
              {activeSection.replace(/-/g, " ")}
            </span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <h1 className="mb-3 text-4xl font-bold text-neutral-900 dark:text-white">
              Clura Documentation
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              Self-hosted OAuth 2.0 / OpenID Connect identity provider. Own your auth
              infrastructure.
            </p>
          </div>

          {/* Overview */}
          <Section id="overview" title="Overview">
            <p>
              Clura is a self-hosted OAuth 2.0 / OpenID Connect identity provider. Developers
              register their applications on the Clura dashboard, then send their end-users to
              Clura's hosted login page. After authentication, Clura issues a signed{" "}
              <Code>id_token</Code>, <Code>access_token</Code>, and <Code>refresh_token</Code> —
              verifiable via Clura's public JWKS endpoint with no SDK required.
            </p>
            <p className="mt-3">
              Think of it as a self-hosted Clerk or Auth0: you own the infrastructure, the keys, and
              the data.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                {
                  title: "No SDK required",
                  desc: "Standard RS256 JWTs verifiable with any JWT library.",
                },
                {
                  title: "No vendor lock-in",
                  desc: "You own the infrastructure, the keys, and the data.",
                },
                { title: "Self-hostable", desc: "Deploy on any server — your rules." },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <p className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
                    {title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* How it works */}
          <Section id="how-it-works" title="How it works">
            <p className="mb-8">
              Clura implements the OAuth 2.0 Authorization Code flow with Google as the identity
              provider.
            </p>
            <div className="space-y-0">
              {[
                "Developer registers an app on the Clura dashboard",
                "Developer redirects user to https://<clura>/user-login/<appClientId>",
                "User authenticates with Google",
                "Clura issues a short-lived authorization code (valid 2 minutes)",
                "Clura redirects to your app's redirectUri with the code parameter",
                "Developer exchanges the code + app_secret for tokens at /v1/global-auth/token",
                "Developer verifies tokens using Clura's JWKS public key",
              ].map((text, i, arr) => (
                <div key={i} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                    )}
                  </div>
                  <p className="pb-4 pt-0.5 text-neutral-700 dark:text-neutral-300">{text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Quickstart */}
          <Section id="quickstart" title="Quickstart">
            <SubHeading>Step 1 — Sign in to the Clura dashboard</SubHeading>
            <p>
              Visit the Clura dashboard and sign in with Google. This creates your developer
              account.
            </p>

            <SubHeading className="mt-8">Step 2 — Create an application</SubHeading>
            <p className="mb-4">
              Click <strong>New app</strong> and enter a name and redirect URI. After creation
              you'll receive:
            </p>
            <Table
              headers={["Value", "Description"]}
              rows={[
                ["appClientId", "Public identifier — safe to embed in URLs"],
                [
                  "appSecret",
                  "Private secret — store server-side only, never expose to the browser",
                ],
                ["redirectUri", "The callback URL you configured"],
              ]}
            />

            <SubHeading className="mt-8">Step 3 — Send users to Clura's login page</SubHeading>
            <p className="mb-1">Redirect your users to:</p>
            <CodeBlock lang="http" code={`https://<clura-host>/user-login/<appClientId>`} />
            <p className="mb-1">
              After sign-in, Clura redirects to your <Code>redirectUri</Code>:
            </p>
            <CodeBlock
              lang="http"
              code={`https://yourapp.com/callback?id_token=<jwt>&access_token=<jwt>&refresh_token=<opaque>`}
            />

            <SubHeading className="mt-8">Step 4 — Handle the callback</SubHeading>
            <CodeBlock
              lang="typescript"
              code={`// Node.js / Express example
app.get("/callback", (req, res) => {
  const { id_token, access_token, refresh_token } = req.query

  // Store refresh_token server-side (httpOnly cookie or encrypted session)
  // Verify id_token or access_token using the JWKS endpoint
})`}
            />

            <SubHeading className="mt-8">Step 5 — Verify tokens</SubHeading>
            <p className="mb-2">Tokens are RS256-signed JWTs. Install dependencies:</p>
            <CodeBlock lang="bash" code={`npm install jwks-rsa jsonwebtoken`} />
            <CodeBlock
              lang="typescript"
              code={`import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"

const client = jwksClient({
  jwksUri: "https://<clura-host>/.well-known/jwks.json",
  cache: true,
  rateLimit: true,
})

async function verifyAccessToken(token: string) {
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || typeof decoded === "string") throw new Error("Invalid token")

  const key = await client.getSigningKey(decoded.header.kid)
  return jwt.verify(token, key.getPublicKey(), {
    algorithms: ["RS256"],
    issuer: "https://<clura-host>",
  })
}`}
            />
            <p className="mb-2 mt-4">The verified payload contains:</p>
            <CodeBlock
              lang="typescript"
              code={`{
  sub: "uuid-of-user",        // stable unique user ID — use as primary key
  app_client_id: "uuid",      // your app's client ID
  sid: "uuid-of-session",     // session ID
  iss: "https://<clura-host>",
  iat: 1234567890,
  exp: 1234567890
}`}
            />
            <p>
              Use <Code>sub</Code> as the stable, unique identifier for the user in your own
              database.
            </p>
          </Section>

          {/* Protecting routes */}
          <Section id="protecting-routes" title="Protecting Routes">
            <SubHeading>Express middleware</SubHeading>
            <CodeBlock
              lang="typescript"
              code={`import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"

const client = jwksClient({
  jwksUri: "https://<clura-host>/.well-known/jwks.json",
  cache: true,
})

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" })
  }
  try {
    const token = header.slice(7)
    const decoded = jwt.decode(token, { complete: true })
    const key = await client.getSigningKey(decoded.header.kid)
    req.user = jwt.verify(token, key.getPublicKey(), {
      algorithms: ["RS256"],
      issuer: "https://<clura-host>",
    })
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// Usage
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ userId: req.user.sub })
})`}
            />

            <SubHeading className="mt-8">Next.js middleware</SubHeading>
            <p className="mb-2">
              Install <Code>jose</Code> for edge-compatible JWT verification:
            </p>
            <CodeBlock lang="bash" code={`npm install jose`} />
            <CodeBlock
              lang="typescript"
              code={`// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import * as jose from "jose"

const JWKS = jose.createRemoteJWKSet(
  new URL("https://<clura-host>/.well-known/jwks.json")
)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  if (!token) return NextResponse.redirect(new URL("/login", req.url))

  try {
    await jose.jwtVerify(token, JWKS, { issuer: "https://<clura-host>" })
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}`}
            />
          </Section>

          {/* Refresh tokens */}
          <Section id="refresh-tokens" title="Refresh Tokens">
            <p className="mb-4">
              Access tokens expire after <strong>15 minutes</strong>. Use the refresh token to
              obtain a new token set without re-authenticating.
            </p>
            <Callout>
              The <Code>appSecret</Code> is required on every refresh request. A stolen refresh
              token alone is not sufficient to rotate it.
            </Callout>
            <SubHeading className="mt-6">Request</SubHeading>
            <CodeBlock
              lang="http"
              code={`POST https://<clura-host>/v1/global-auth/refresh
Content-Type: application/json

{
  "refresh_token": "64-char-hex-string",
  "app_client_id": "your-app-client-id",
  "app_secret": "your-app-secret"
}`}
            />
            <SubHeading className="mt-6">Response</SubHeading>
            <CodeBlock
              lang="json"
              code={`{
  "id_token": "eyJ...",
  "access_token": "eyJ...",
  "refresh_token": "new-64-char-hex"
}`}
            />
            <p className="mt-4">
              Each refresh call invalidates the old token and issues a new one (rotation). Store the
              new <Code>refresh_token</Code> immediately.
            </p>
          </Section>

          {/* Token reference */}
          <Section id="token-reference" title="Token Reference">
            <div className="mb-10 space-y-4">
              {[
                {
                  name: "Authorization Code",
                  format: "Opaque 64-char hex string",
                  expiry: "2 min",
                  purpose: "Short-lived code exchanged for a full token set. Single-use only.",
                },
                {
                  name: "ID Token",
                  format: "RS256 JWT",
                  expiry: "1 hour",
                  purpose: "Verify user identity once after login. Contains profile data.",
                },
                {
                  name: "Access Token",
                  format: "RS256 JWT",
                  expiry: "15 min",
                  purpose: "Authenticate API requests. Send as Authorization: Bearer <token>.",
                },
                {
                  name: "Refresh Token",
                  format: "Opaque 64-char hex string",
                  expiry: "7 days",
                  purpose:
                    "Exchange for a new token set when the access token expires. Server-side only.",
                },
              ].map(({ name, format, expiry, purpose }) => (
                <div
                  key={name}
                  className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{name}</h3>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                      {expiry}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <strong>Format:</strong> {format}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{purpose}</p>
                </div>
              ))}
            </div>
            <SubHeading>ID Token payload</SubHeading>
            <CodeBlock
              lang="json"
              code={`{
  "sub": "uuid-of-user",
  "email": "user@example.com",
  "name": "Jane Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "https://<clura-host>",
  "iat": 1234567890,
  "exp": 1234567890
}`}
            />
            <SubHeading className="mt-6">Access Token payload</SubHeading>
            <CodeBlock
              lang="json"
              code={`{
  "sub": "uuid-of-user",
  "app_client_id": "uuid-of-your-app",
  "sid": "uuid-of-session",
  "iss": "https://<clura-host>",
  "iat": 1234567890,
  "exp": 1234567890
}`}
            />
          </Section>

          {/* API Reference */}
          <Section id="api-reference" title="API Reference">
            <p className="mb-6">
              All endpoints require <Code>Authorization: Bearer &lt;developer-token&gt;</Code> — the
              token you receive after signing in to the Clura dashboard.
            </p>
            <Table
              headers={["Method", "Endpoint", "Description"]}
              rows={[
                ["POST", "/v1/app", "Create a new app"],
                ["GET", "/v1/app", "List all your apps"],
                ["GET", "/v1/app/:id", "Get a specific app"],
                ["PATCH", "/v1/app/:id", "Update app name or redirectUri"],
                ["DELETE", "/v1/app/:id", "Delete an app"],
                [
                  "GET",
                  "/v1/app/validate/:appClientId",
                  "Check if an appClientId exists (public, no auth)",
                ],
              ]}
            />

            <SubHeading className="mt-8">Create app</SubHeading>
            <CodeBlock
              lang="http"
              code={`POST /v1/app
Authorization: Bearer <developer-token>
Content-Type: application/json

{
  "name": "My App",
  "redirectUri": "https://yourapp.com/callback"
}`}
            />
            <SubHeading className="mt-6">Response</SubHeading>
            <CodeBlock
              lang="json"
              code={`{
  "id": "uuid",
  "appClientId": "uuid",
  "appSecret": "64-char-hex",
  "name": "My App",
  "redirectUri": "https://yourapp.com/callback",
  "createdAt": "2024-01-01T00:00:00.000Z"
}`}
            />
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              The <Code>appSecret</Code> is returned only on creation and never again.
            </p>

            <SubHeading className="mt-8">Discovery endpoints</SubHeading>
            <Table
              headers={["Endpoint", "Description"]}
              rows={[
                ["GET /.well-known/jwks.json", "RSA public key for token verification"],
                ["GET /.well-known/openid-configuration", "OpenID Connect discovery document"],
              ]}
            />
          </Section>

          {/* Self-hosting */}
          <Section id="self-hosting" title="Self-hosting">
            <SubHeading>Prerequisites</SubHeading>
            <ul className="mb-6 list-inside list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Bun v1.3+</li>
              <li>PostgreSQL database</li>
              <li>Google Cloud project with OAuth 2.0 credentials</li>
            </ul>

            <SubHeading>1. Clone and install</SubHeading>
            <CodeBlock
              lang="bash"
              code={`git clone https://github.com/your-username/clura.git
cd clura
bun install`}
            />

            <SubHeading className="mt-8">2. Generate RSA key pair</SubHeading>
            <CodeBlock
              lang="bash"
              code={`node -e "
const { generateKeyPairSync } = require('crypto');
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
console.log(JSON.stringify(privateKey));
console.log(JSON.stringify(publicKey));
"`}
            />

            <SubHeading className="mt-8">3. Configure environment</SubHeading>
            <p className="mb-2">
              Create <Code>server/.env</Code>:
            </p>
            <CodeBlock
              lang="bash"
              code={`DATABASE_URL=postgresql://user:password@localhost:5432/clura
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/v1/auth/google/callback
GLOBAL_REDIRECT_URI=http://localhost:8000/v1/global-auth/callback
JWT_SECRET=a-long-random-string
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----\\n"
JWT_KEY_ID=clura-1
JWT_ISSUER=http://localhost:8000
FRONTEND_URL=http://localhost:3000`}
            />
            <p className="mb-2 mt-4">
              Create <Code>client/.env.local</Code>:
            </p>
            <CodeBlock lang="bash" code={`NEXT_PUBLIC_API_URL=http://localhost:8000`} />

            <SubHeading className="mt-8">4. Run migrations</SubHeading>
            <CodeBlock
              lang="bash"
              code={`cd server
bunx drizzle-kit generate
bunx drizzle-kit migrate`}
            />

            <SubHeading className="mt-8">5. Add Google redirect URIs</SubHeading>
            <p className="mb-2">
              In Google Cloud Console → Credentials, add to Authorized redirect URIs:
            </p>
            <CodeBlock
              code={`http://localhost:8000/v1/auth/google/callback
http://localhost:8000/v1/global-auth/callback`}
            />

            <SubHeading className="mt-8">6. Start</SubHeading>
            <CodeBlock
              lang="bash"
              code={`bun run dev:server    # API on port 8000
bun run dev:client    # Dashboard on port 3000`}
            />
          </Section>

          {/* Database Schema */}
          <Section id="database-schema" title="Database Schema">
            {[
              {
                name: "client_table",
                desc: "Developer accounts",
                cols: [
                  ["id", "uuid PK", "Developer ID"],
                  ["google_id", "varchar", "Google OAuth sub"],
                  ["name", "varchar", "Display name"],
                  ["email", "varchar", "Email address"],
                  ["avatar", "varchar", "Profile picture URL"],
                  ["created_at", "timestamp", "Account creation time"],
                ],
              },
              {
                name: "app_table",
                desc: "Registered applications",
                cols: [
                  ["id", "uuid PK", "Internal app ID"],
                  ["client_id", "uuid FK", "Owner developer"],
                  ["name", "varchar", "App display name"],
                  ["app_client_id", "uuid", "Public client identifier"],
                  ["app_secret", "varchar(64)", "Secret for refresh token validation"],
                  ["redirect_uri", "varchar(2048)", "Post-login redirect URL"],
                  ["created_at", "timestamp", "Registration time"],
                ],
              },
              {
                name: "user_table",
                desc: "End-users",
                cols: [
                  ["id", "uuid PK", "User ID — the sub claim in all tokens"],
                  ["google_id", "varchar", "Google OAuth sub"],
                  ["name", "varchar", "Display name"],
                  ["email", "varchar", "Email address"],
                  ["avatar", "varchar", "Profile picture URL"],
                  ["created_at", "timestamp", "First login time"],
                ],
              },
              {
                name: "session_table",
                desc: "Active sessions",
                cols: [
                  ["id", "uuid PK", "Session ID — the sid claim in tokens"],
                  ["user_id", "uuid FK", "End-user"],
                  ["app_client_id", "uuid FK", "App the session belongs to"],
                  ["refresh_token", "varchar(128)", "SHA-256 hash of the raw token"],
                  ["created_at", "timestamp", "Session creation time"],
                  ["expires_at", "timestamp", "7-day expiry"],
                ],
              },
              {
                name: "auth_code_table",
                desc: "Temporary authorization codes",
                cols: [
                  ["id", "uuid PK", "Internal ID"],
                  ["code", "varchar(64)", "Authorization code sent to client"],
                  ["app_client_id", "uuid FK", "App the code belongs to"],
                  ["id_token", "varchar", "Pre-generated ID token"],
                  ["access_token", "varchar", "Pre-generated access token"],
                  ["refresh_token", "varchar(64)", "Raw refresh token"],
                  ["expires_at", "timestamp", "2-minute expiry"],
                  ["used", "boolean", "Whether the code has been exchanged"],
                ],
              },
            ].map(({ name, desc, cols }) => (
              <div key={name} className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                  <code className="font-mono text-sm font-semibold text-violet-700 dark:text-violet-400">
                    {name}
                  </code>
                  <span className="text-sm text-neutral-400 dark:text-neutral-500">— {desc}</span>
                </div>
                <Table headers={["Column", "Type", "Description"]} rows={cols} />
              </div>
            ))}
          </Section>

          <div className="mt-16 border-t border-neutral-200 pt-8 text-center dark:border-neutral-800">
            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              Clura — self-hosted auth infrastructure
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-6">
      <h2 className="mb-6 border-b border-neutral-200 pb-3 text-2xl font-bold text-neutral-900 dark:border-neutral-800 dark:text-white">
        {title}
      </h2>
      <div className="leading-relaxed text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}

function SubHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`mb-3 text-base font-semibold text-neutral-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-violet-700 dark:bg-neutral-800 dark:text-violet-400">
      {children}
    </code>
  );
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="relative my-5">
      {lang && (
        <span className="absolute right-3 top-3 select-none font-mono text-xs text-neutral-500">
          {lang}
        </span>
      )}
      <pre className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-sm leading-relaxed dark:bg-neutral-900">
        <code className="font-mono text-neutral-200">{code.trim()}</code>
      </pre>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${
                    j === 0
                      ? "font-mono text-xs text-violet-700 dark:text-violet-400"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
      <p className="text-sm text-amber-800 dark:text-amber-300">{children}</p>
    </div>
  );
}
