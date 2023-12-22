import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, string, maxLength, length } from "valibot";

export const usersWithCredentials = sqliteTable("usersWithCredentials", {
    id: text("id").notNull().primaryKey(),
    password: text("password").notNull()
});

export type usersWithCredentialsDB = InferSelectModel<typeof usersWithCredentials>;
export type InsertUsersWithCredentials = InferInsertModel<typeof usersWithCredentials>

export const insertNewUserCredsSchema = createInsertSchema(usersWithCredentials, {
    id: string("No ID specified! Give a unique one."),
    //taken from https://valibot.dev/guides/schemas/
    password: string('Your password must be a string.', [
        minLength(8, 'Your password must have 8 characters or more.'),
        maxLength(22, 'Your password can\'t be longer than 22 characters.')
    ]),
})
