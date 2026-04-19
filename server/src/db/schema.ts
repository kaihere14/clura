import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clientTable = pgTable("client_table", {
  id: uuid().primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appTable = pgTable("app_table", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clientTable.id),
  name: varchar({ length: 255 }).notNull(),
  appClientId: uuid("app_client_id").defaultRandom().notNull().unique(),
  appSecret: varchar("app_secret", { length: 64 }).notNull().unique(),
  redirectUri: varchar("redirect_uri", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userTable = pgTable("user_table", {
  id: uuid().primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionTable = pgTable("session_table", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  appClientId: uuid("app_client_id")
    .notNull()
    .references(() => appTable.appClientId),
  refreshToken: varchar("refresh_token", { length: 128 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const clientRelations = relations(clientTable, ({ many }) => ({
  apps: many(appTable),
}));

export const appRelations = relations(appTable, ({ one }) => ({
  client: one(clientTable, {
    fields: [appTable.clientId],
    references: [clientTable.id],
  }),
}));

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
