import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersDB = sqliteTable("usersDB", {
    username: text("username").primaryKey(),
    password: text("text"), ///maybe using hash, so encrypting on frontend before adding to the database 
});

export type usersDB = InferSelectModel<typeof usersDB>;
export type InsertTest = InferInsertModel<typeof usersDB>;