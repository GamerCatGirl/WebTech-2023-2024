import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const test = sqliteTable("test", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    text: text("text"),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Test = InferSelectModel<typeof test>;
export type InsertTest = InferInsertModel<typeof test>;
