import { eq } from "drizzle-orm";
import { db } from "../../db";
import { clientTable } from "../../db/schema";

export interface GoogleProfile {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
}

export const getClientById = async (id: number) => {
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
