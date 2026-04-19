import type { Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "./auth.middleware";
import { upsertClient, getClientById } from "./auth.service";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_SECRET } = process.env;

const pendingStates = new Set<string>();

export const openIdRedirect = (_req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.add(state);
  setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
};

export const openIdCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query as Record<string, string>;
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
  const redirectError = (msg: string) => res.redirect(`${frontendUrl}/auth/callback?error=${msg}`);

  if (error) {
    redirectError("oauth_error");
    return;
  }

  if (!state || !pendingStates.has(state)) {
    redirectError("invalid_state");
    return;
  }
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
      redirect_uri: GOOGLE_REDIRECT_URI!,
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

  const client = await upsertClient({
    googleId: profile.sub,
    name: profile.name,
    email: profile.email,
    avatar: profile.picture,
  });

  const token = jwt.sign({ clientId: client?.id, email: client?.email }, JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const client = await getClientById(req.client!.clientId);

  if (!client) {
    res.status(404).json({ message: "Client not found" });
    return;
  }

  res.json(client);
};
