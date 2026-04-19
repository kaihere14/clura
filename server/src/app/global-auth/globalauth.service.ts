import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "../../db";
import { userTable, sessionTable, appTable } from "../../db/schema";

export interface GoogleProfile {
  googleId: string;
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
