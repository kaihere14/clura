import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "../../db";
import { userTable, sessionTable, appTable, authCodeTable, ssoSessionTable } from "../../db/schema";

export interface GoogleProfile {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface GithubProfile {
  githubId: string;
  name: string;
  email: string;
  avatar?: string;
}

export const upsertUser = async (profile: GoogleProfile) => {
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.googleId, profile.googleId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [user] = await db
    .insert(userTable)
    .values({
      googleId: profile.googleId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    })
    .returning();

  return user;
};

export const upsertUserByGithub = async (profile: GithubProfile) => {
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.githubId, profile.githubId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [user] = await db
    .insert(userTable)
    .values({
      githubId: profile.githubId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    })
    .returning();

  return user;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
  return user ?? null;
};

export const createUserWithPassword = async (email: string, name: string, passwordHash: string) => {
  const [user] = await db.insert(userTable).values({ email, name, passwordHash }).returning();
  return user!;
};

export const getAppByClientId = async (appClientId: string) => {
  const [app] = await db
    .select()
    .from(appTable)
    .where(eq(appTable.appClientId, appClientId))
    .limit(1);
  return app ?? null;
};

export const createSession = async (userId: string, appClientId: string) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [session] = await db
    .insert(sessionTable)
    .values({ userId, appClientId, refreshToken: hashedToken, expiresAt })
    .returning();

  return { session, rawToken };
};

export const rotateSession = async (hashedToken: string, appClientId: string) => {
  const [session] = await db
    .select()
    .from(sessionTable)
    .where(
      and(eq(sessionTable.refreshToken, hashedToken), eq(sessionTable.appClientId, appClientId)),
    )
    .limit(1);

  if (!session || session.expiresAt < new Date()) return null;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const newHashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [updated] = await db
    .update(sessionTable)
    .set({ refreshToken: newHashedToken, expiresAt })
    .where(eq(sessionTable.id, session.id))
    .returning();

  return { session: updated, rawToken, userId: session.userId };
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
  return user ?? null;
};

export const getAppBySecret = async (appSecret: string) => {
  const [app] = await db.select().from(appTable).where(eq(appTable.appSecret, appSecret)).limit(1);
  return app ?? null;
};

export const createAuthCode = async (params: {
  appClientId: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
}) => {
  const code = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  const [authCode] = await db
    .insert(authCodeTable)
    .values({ code, ...params, expiresAt, used: false })
    .returning();
  if (!authCode) throw new Error("Failed to create auth code");
  return authCode;
};

export const generateSSOToken = () => crypto.randomBytes(32).toString("hex");

export const hashToken = (raw: string) => crypto.createHash("sha256").update(raw).digest("hex");

export const createSSOSession = async (userId: string) => {
  const rawToken = generateSSOToken();
  const token = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(ssoSessionTable).values({ userId, token, expiresAt });
  return rawToken;
};

export const verifySSOCookie = async (raw: string) => {
  const token = hashToken(raw);
  const [ssoSession] = await db
    .select()
    .from(ssoSessionTable)
    .where(eq(ssoSessionTable.token, token))
    .limit(1);
  if (!ssoSession || ssoSession.expiresAt < new Date()) return null;
  return ssoSession;
};

export const deleteSSOSession = async (raw: string) => {
  const token = hashToken(raw);
  await db.delete(ssoSessionTable).where(eq(ssoSessionTable.token, token));
};

export const deleteAllUserSSOSessions = async (userId: string) => {
  await db.delete(ssoSessionTable).where(eq(ssoSessionTable.userId, userId));
};

export const exchangeAuthCode = async (code: string, appClientId: string) => {
  const [authCode] = await db
    .select()
    .from(authCodeTable)
    .where(and(eq(authCodeTable.code, code), eq(authCodeTable.appClientId, appClientId)))
    .limit(1);

  if (!authCode || authCode.used || authCode.expiresAt < new Date()) return null;

  await db.update(authCodeTable).set({ used: true }).where(eq(authCodeTable.id, authCode.id));

  return {
    idToken: authCode.idToken,
    accessToken: authCode.accessToken,
    refreshToken: authCode.refreshToken,
  };
};
