import type { Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "./auth.middleware";
import { upsertClient, upsertClientByGithub, getClientById } from "./auth.service";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USERINFO_URL = "https://api.github.com/user";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_UI,
} = process.env;

const pendingStates = new Set<string>();

export const googleIdRedirect = (_req: Request, res: Response) => {
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

export const googleIdCallback = async (req: Request, res: Response) => {
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

export const githubIdRedirect = (_req: Request, res: Response) => {
  const state = crypto.randomBytes(16).toString("hex");
  pendingStates.add(state);
  setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID!,
    redirect_uri: GITHUB_REDIRECT_UI!,
    scope: "read:user user:email",
    state,
  });

  res.redirect(`${GITHUB_AUTH_URL}?${params}`);
};

export const githubIdCallback = async (req: Request, res: Response) => {
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

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: GITHUB_CLIENT_ID!,
      client_secret: GITHUB_CLIENT_SECRET!,
      redirect_uri: GITHUB_REDIRECT_UI!,
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

  const client = await upsertClientByGithub({
    githubId: String(profile.id),
    name: profile.name ?? profile.login,
    email,
    avatar: profile.avatar_url,
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
