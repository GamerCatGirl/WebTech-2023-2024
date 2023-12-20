import crypto from "crypto";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, foreignKey } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { Column } from "#build/components";

export const usersWithCredentials = sqliteTable("usersWithCredentials", {
    id: text("id").notNull().primaryKey(),
    password: text("password").notNull()
});

export type usersWithCredentialsDB = InferSelectModel<typeof usersWithCredentials>;
export type InsertUsersWithCredentials = InferInsertModel<typeof usersWithCredentials>