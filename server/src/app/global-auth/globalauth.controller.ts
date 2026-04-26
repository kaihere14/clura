import type { Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import * as service from "./globalauth.service";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USERINFO_URL = "https://api.github.com/user";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GLOBAL_REDIRECT_URI,
  GLOBAL_GITHUB_REDIRECT_URI,
  FRONTEND_URL,
  JWT_PRIVATE_KEY,
  JWT_KEY_ID,
  JWT_ISSUER,
  GLOBAL_GITHUB_CLIENT_ID,
  GLOBAL_GITHUB_CLIENT_SECRET,
} = process.env;

const pendingStates = new Map<string, string>();

const SSO_COOKIE = "clura_sso_session";
const SSO_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setSSOCookie = (res: Response, raw: string) => {
  res.cookie(SSO_COOKIE, raw, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SSO_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
};

const signToken = (payload: object, expiresIn: string) =>
  jwt.sign(payload, JWT_PRIVATE_KEY!.replace(/\\n/g, "\n"), {
    algorithm: "RS256",
    keyid: JWT_KEY_ID,
    expiresIn,
    issuer: JWT_ISSUER,
  } as jwt.SignOptions);

const buildTokens = (
  userId: string,
  appClientId: string,
  sessionId: string,
  user: { email: string; name: string; avatar?: string | null },
) => {
  const base = { sub: userId, app_client_id: appClientId, sid: sessionId };
  const idToken = signToken(
    { ...base, email: user.email, name: user.name, picture: user.avatar ?? null },
    "1h",
  );
  const accessToken = signToken(base, "15m");
  return { idToken, accessToken };
};

export const globalOpenIdRedirect = (req: Request, res: Response) => {
  const { appClientId } = req.query as Record<string, string>;
  const frontendUrl = FRONTEND_URL ?? "http://localhost:3000";

  if (!appClientId) {
    res.redirect(`${frontendUrl}/user-login/error?error=missing_app_client_id`);
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.set(state, appClientId);
  setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: GLOBAL_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
};

export const globalOpenIdCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;
  const frontendUrl = FRONTEND_URL ?? "http://localhost:3000";
  const redirectError = (msg: string) =>
    res.redirect(`${frontendUrl}/user-login/error?error=${msg}`);

  if (error) {
    redirectError("oauth_error");
    return;
  }
  if (!state || !pendingStates.has(state)) {
    redirectError("invalid_state");
    return;
  }

  const appClientId = pendingStates.get(state)!;
  pendingStates.delete(state);

  if (!code) {
    redirectError("missing_code");
    return;
  }

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: GLOBAL_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    redirectError("token_exchange_failed");
    return;
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profileRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    redirectError("profile_fetch_failed");
    return;
  }

  const profile = (await profileRes.json()) as {
    sub: string;
    name: string;
    email: string;
    picture?: string;
  };

  const app = await service.getAppByClientId(appClientId);
  if (!app) {
    redirectError("app_not_found");
    return;
  }

  const user = await service.upsertUser({
    googleId: profile.sub,
    name: profile.name,
    email: profile.email,
    avatar: profile.picture,
  });

  const { session, rawToken } = await service.createSession(user!.id, appClientId);
  const { idToken, accessToken } = buildTokens(user!.id, appClientId, session!.id, user!);

  const authCode = await service.createAuthCode({
    appClientId,
    idToken,
    accessToken,
    refreshToken: rawToken,
  });

  const rawSSOToken = await service.createSSOSession(user!.id);
  setSSOCookie(res, rawSSOToken);

  const redirectUrl = new URL(app.redirectUri);
  redirectUrl.searchParams.set("code", authCode.code);

  res.redirect(redirectUrl.toString());
};

export const globalGithubRedirect = (req: Request, res: Response) => {
  const { appClientId } = req.query as Record<string, string>;
  const frontendUrl = FRONTEND_URL ?? "http://localhost:3000";

  if (!appClientId) {
    res.redirect(`${frontendUrl}/user-login/error?error=missing_app_client_id`);
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.set(state, appClientId);
  setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: GLOBAL_GITHUB_CLIENT_ID!,
    redirect_uri: GLOBAL_GITHUB_REDIRECT_URI!,
    scope: "read:user user:email",
    state,
  });

  res.redirect(`${GITHUB_AUTH_URL}?${params}`);
};

export const globalGithubCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;
  const frontendUrl = FRONTEND_URL ?? "http://localhost:3000";
  const redirectError = (msg: string) =>
    res.redirect(`${frontendUrl}/user-login/error?error=${msg}`);

  if (error) {
    redirectError("oauth_error");
    return;
  }
  if (!state || !pendingStates.has(state)) {
    redirectError("invalid_state");
    return;
  }

  const appClientId = pendingStates.get(state)!;
  pendingStates.delete(state);

  if (!code) {
    redirectError("missing_code");
    return;
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: GLOBAL_GITHUB_CLIENT_ID!,
      client_secret: GLOBAL_GITHUB_CLIENT_SECRET!,
      redirect_uri: GLOBAL_GITHUB_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    redirectError("token_exchange_failed");
    return;
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profileRes = await fetch(GITHUB_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!profileRes.ok) {
    redirectError("profile_fetch_failed");
    return;
  }

  const profile = (await profileRes.json()) as {
    id: number;
    name: string;
    email: string | null;
    avatar_url?: string;
    login: string;
  };

  let email = profile.email;

  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (emailsRes.ok) {
      const emails = (await emailsRes.json()) as {
        email: string;
        primary: boolean;
        verified: boolean;
      }[];
      email =
        emails.find((e) => e.primary && e.verified)?.email ??
        emails.find((e) => e.verified)?.email ??
        null;
    }
  }

  if (!email) {
    redirectError("email_required");
    return;
  }

  const app = await service.getAppByClientId(appClientId);
  if (!app) {
    redirectError("app_not_found");
    return;
  }

  const user = await service.upsertUserByGithub({
    githubId: String(profile.id),
    name: profile.name ?? profile.login,
    email,
    avatar: profile.avatar_url,
  });

  const { session, rawToken } = await service.createSession(user!.id, appClientId);
  const { idToken, accessToken } = buildTokens(user!.id, appClientId, session!.id, user!);

  const authCode = await service.createAuthCode({
    appClientId,
    idToken,
    accessToken,
    refreshToken: rawToken,
  });

  const rawSSOToken = await service.createSSOSession(user!.id);
  setSSOCookie(res, rawSSOToken);

  const redirectUrl = new URL(app.redirectUri);
  redirectUrl.searchParams.set("code", authCode.code);

  res.redirect(redirectUrl.toString());
};

export const globalRefreshTokens = async (req: Request, res: Response) => {
  const { refresh_token, app_client_id, app_secret } = req.body as {
    refresh_token?: string;
    app_client_id?: string;
    app_secret?: string;
  };

  if (!refresh_token || !app_client_id || !app_secret) {
    res.status(400).json({ message: "refresh_token, app_client_id and app_secret are required" });
    return;
  }

  const app = await service.getAppByClientId(app_client_id);
  if (!app || app.appSecret !== app_secret) {
    res.status(401).json({ message: "Invalid app credentials" });
    return;
  }

  const hashedToken = crypto.createHash("sha256").update(refresh_token).digest("hex");
  const result = await service.rotateSession(hashedToken, app_client_id);

  if (!result) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
    return;
  }

  const user = await service.getUserById(result.userId);
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  const { idToken, accessToken } = buildTokens(user.id, app_client_id, result.session!.id, user);

  res.json({ id_token: idToken, access_token: accessToken, refresh_token: result.rawToken });
};

export const checkLoginStatus = async (req: Request, res: Response) => {
  const { appClientId } = req.query as Record<string, string>;

  if (!appClientId) {
    res.json({ status: "invalid" });
    return;
  }

  const app = await service.getAppByClientId(appClientId);
  if (!app) {
    res.json({ status: "invalid" });
    return;
  }

  const rawSSOToken = req.cookies[SSO_COOKIE] as string | undefined;
  if (!rawSSOToken) {
    res.json({ status: "login" });
    return;
  }

  const ssoSession = await service.verifySSOCookie(rawSSOToken);
  if (!ssoSession) {
    res.json({ status: "login" });
    return;
  }

  const user = await service.getUserById(ssoSession.userId);
  if (!user) {
    res.json({ status: "login" });
    return;
  }

  const { session, rawToken } = await service.createSession(user.id, appClientId);
  const { idToken, accessToken } = buildTokens(user.id, appClientId, session!.id, user);
  const authCode = await service.createAuthCode({
    appClientId,
    idToken,
    accessToken,
    refreshToken: rawToken,
  });

  const redirectUrl = new URL(app.redirectUri);
  redirectUrl.searchParams.set("code", authCode.code);

  res.json({ status: "redirect", url: redirectUrl.toString() });
};

export const globalLogout = async (req: Request, res: Response) => {
  const rawToken = req.cookies[SSO_COOKIE] as string | undefined;
  if (rawToken) {
    await service.deleteSSOSession(rawToken);
  }
  res.clearCookie(SSO_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
};

export const globalLogoutRedirect = async (req: Request, res: Response) => {
  const rawToken = req.cookies[SSO_COOKIE] as string | undefined;
  if (rawToken) {
    await service.deleteSSOSession(rawToken);
  }
  res.clearCookie(SSO_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  const next = req.query.next as string | undefined;
  const frontendUrl = FRONTEND_URL ?? "http://localhost:3000";
  res.redirect(next ?? frontendUrl);
};

export const exchangeCode = async (req: Request, res: Response) => {
  const { code, app_secret } = req.body as { code?: string; app_secret?: string };

  if (!code || !app_secret) {
    res.status(400).json({ message: "code and app_secret are required" });
    return;
  }

  const app = await service.getAppBySecret(app_secret);
  if (!app) {
    res.status(401).json({ message: "Invalid app credentials" });
    return;
  }

  const tokens = await service.exchangeAuthCode(code, app.appClientId);
  if (!tokens) {
    res.status(401).json({ message: "Invalid, expired, or already used code" });
    return;
  }

  res.json({
    id_token: tokens.idToken,
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });
};
