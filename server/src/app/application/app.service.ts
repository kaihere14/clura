import { and, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "../../db";
import { appTable } from "../../db/schema";

const appPublicColumns = {
  id: appTable.id,
  clientId: appTable.clientId,
  name: appTable.name,
  appClientId: appTable.appClientId,
  redirectUri: appTable.redirectUri,
  createdAt: appTable.createdAt,
};

export const createApp = async (clientId: string, name: string, redirectUri: string) => {
  const appSecret = crypto.randomBytes(32).toString("hex");
  const [app] = await db
    .insert(appTable)
    .values({ clientId, name, appSecret, redirectUri })
    .returning();
  return app;
};

export const getAppsByClient = async (clientId: string) => {
  return db.select(appPublicColumns).from(appTable).where(eq(appTable.clientId, clientId));
};

export const getAppById = async (id: string, clientId: string) => {
  const [app] = await db
    .select(appPublicColumns)
    .from(appTable)
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .limit(1);
  return app ?? null;
};

export const updateApp = async (
  id: string,
  clientId: string,
  name: string,
  redirectUri?: string,
) => {
  const [app] = await db
    .update(appTable)
    .set({ name, ...(redirectUri ? { redirectUri } : {}) })
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .returning(appPublicColumns);
  return app ?? null;
};

export const validateAppClientId = async (appClientId: string): Promise<boolean> => {
  const [app] = await db
    .select({ id: appTable.id })
    .from(appTable)
    .where(eq(appTable.appClientId, appClientId))
    .limit(1);
  return !!app;
};

export const deleteApp = async (id: string, clientId: string) => {
  const [app] = await db
    .delete(appTable)
    .where(and(eq(appTable.id, id), eq(appTable.clientId, clientId)))
    .returning();
  return app ?? null;
};
