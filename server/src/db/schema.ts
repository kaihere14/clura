import { integer, pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const clientTable = pgTable("client_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  avatar: varchar({ length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appTable = pgTable("app_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clientTable.id),
  name: varchar({ length: 255 }).notNull(),
  appClientId: uuid("app_client_id").defaultRandom().notNull().unique(),
  appSecret: varchar("app_secret", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
