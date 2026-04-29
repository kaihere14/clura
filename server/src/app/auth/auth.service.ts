import { eq } from "drizzle-orm";
import { db } from "../../db";
import { clientTable } from "../../db/schema";

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

export const getClientById = async (id: string) => {
  const [client] = await db.select().from(clientTable).where(eq(clientTable.id, id)).limit(1);
  return client ?? null;
};

export const upsertClient = async (profile: GoogleProfile) => {
  const existing = await db
    .select()
    .from(clientTable)
    .where(eq(clientTable.googleId, profile.googleId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [client] = await db
    .insert(clientTable)
    .values({
      googleId: profile.googleId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    })
    .returning();

  return client;
};

export const getClientByEmail = async (email: string) => {
  const [client] = await db.select().from(clientTable).where(eq(clientTable.email, email)).limit(1);
  return client ?? null;
};

export const createClientWithPassword = async (
  email: string,
  name: string,
  passwordHash: string,
) => {
  const [client] = await db.insert(clientTable).values({ email, name, passwordHash }).returning();
  return client!;
};

export const upsertClientByGithub = async (profile: GithubProfile) => {
  const existing = await db
    .select()
    .from(clientTable)
    .where(eq(clientTable.githubId, profile.githubId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [client] = await db
    .insert(clientTable)
    .values({
      githubId: profile.githubId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    })
    .returning();

  return client;
};
