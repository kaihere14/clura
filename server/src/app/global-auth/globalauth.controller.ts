import type { Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import * as service from "./globalauth.service";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GLOBAL_REDIRECT_URI,
  FRONTEND_URL,
  JWT_PRIVATE_KEY,
  JWT_KEY_ID,
  JWT_ISSUER,
} = process.env;

// state → appClientId
const pendingStates = new Map<string, string>();

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
  const { idToken, accessToken } = buildTokens(user!.id, appClientId, session.id, user!);

  const redirectUrl = new URL(app.redirectUri);
  redirectUrl.searchParams.set("id_token", idToken);
  redirectUrl.searchParams.set("access_token", accessToken);
  redirectUrl.searchParams.set("refresh_token", rawToken);

  res.redirect(redirectUrl.toString());
};

export const globalRefreshTokens = async (req: Request, res: Response) => {
  const { refresh_token, app_client_id } = req.body as {
    refresh_token?: string;
    app_client_id?: string;
  };

  if (!refresh_token || !app_client_id) {
    res.status(400).json({ message: "refresh_token and app_client_id are required" });
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

  const { idToken, accessToken } = buildTokens(user.id, app_client_id, result.session.id, user);

  res.json({ id_token: idToken, access_token: accessToken, refresh_token: result.rawToken });
};
