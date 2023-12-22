import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersWithCredentials = sqliteTable("usersWithCredentials", {
    id: text("id").notNull().primaryKey(),
    password: text("password").notNull()
});

export type usersWithCredentialsDB = InferSelectModel<typeof usersWithCredentials>;
export type InsertUsersWithCredentials = InferInsertModel<typeof usersWithCredentials>
