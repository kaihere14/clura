import { and, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "../../db";
import { appTable } from "../../db/schema";

export const createApp = async (clientId: number, name: string) => {
  const appSecret = crypto.randomBytes(32).toString("hex");
  const [app] = await db.insert(appTable).values({ clientId, name, appSecret }).returning();
  return app;
};

export const getAppsByClient = async (clientId: number) => {
  return db.select().from(appTable).where(eq(appTable.clientId, clientId));
};

export const getAppById = async (id: number, clientId: number) => {
  const [app] = await db
    .select()
    .from(appTable)
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .limit(1);
  return app ?? null;
};

export const updateApp = async (id: number, clientId: number, name: string) => {
  const [app] = await db
    .update(appTable)
    .set({ name })
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .returning();
  return app ?? null;
};

export const deleteApp = async (id: number, clientId: number) => {
  const [app] = await db
    .delete(appTable)
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .returning();
  return app ?? null;
};
