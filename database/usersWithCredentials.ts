import crypto from "crypto";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersWithCredentials = sqliteTable("usersWithCredentials", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").unique(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    country: text("country"),
}
)

export type usersWithCredentialsDB = InferSelectModel<typeof usersWithCredentials>;
export type InsertUsersWithCredentials = InferInsertModel<typeof usersWithCredentials>