import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-valibot";
import { minLength, string, undefined_, length, email } from "valibot";
import type { AdapterAccount } from "@auth/core/adapters"
import crypto from "crypto";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  country: text("country"),
})

export const follower = sqliteTable("follower", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  idFollower: text("id follower")
    .notNull(),
  idFollowing: text("id following")
    .notNull(),
})

export type Followers = InferSelectModel<typeof follower>;
export type InsertFollowers = InferInsertModel<typeof follower>;

export const apiKey = sqliteTable("apiKey", {
  key: text("id").notNull().primaryKey(),
  user: text("user").references(() => users.id).notNull(),
})

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId)
  })
)

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull()
})

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
  })
)

export type usersDB = InferSelectModel<typeof users>;
export type InsertUsers = InferInsertModel<typeof users>;

export const insertUserSchema = createInsertSchema(users, {
  id: undefined_("No ID should be specified."),
  name: string("Please give a valid userName a name to your recipe", [
    minLength(4, "The name of the username should be longer than 4 characters"),
  ]),
  email: undefined_("No email should be specified."),
  emailVerified: undefined_("No emailVerified should be specified."),
  image: undefined_("No image should be specified."),
  country: string("Please chose a country", [
    length(2, "Give a valid countryKey")
  ])
})

export const insertNewUserSchema = createInsertSchema(users, {
  id: string("No ID specified! Give a unique one."),
  name: string("Please give a valid userName a name to your recipe", [
    minLength(4, "The name of the username should be longer than 4 characters"),
  ]),
  email: string("The input must be an e-mail", [
    minLength(3, "The email seems to be too short."),
    email("Please specify a valid e-mail.")]),
  emailVerified: undefined_("No emailVerified should be specified."),
  image: undefined_("No image should be specified."),
  country: string("Please chose a country", [
    length(2, "Give a valid countryKey!")
  ])
})
