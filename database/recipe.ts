import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";

export const images = sqliteTable("image", {
    id: integer("id").primaryKey(),
    url: text("url").notNull(),
    recipe: integer("recipe_id")
        .references(() => recipes.id)
        .notNull(),
});

export type Image = InferSelectModel<typeof images>;
export type InsertImage = InferInsertModel<typeof images>;

export const imagesRelations = relations(images, ({ one }) => ({
    recipe: one(recipes, { fields: [images.recipe], references: [recipes.id] }),
}));

export const recipes = sqliteTable("recipe", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    location: text("location").notNull(),
    description: text("description").notNull(),
    user: integer("user")
        .references(() => users.id)
        .notNull(),
});

export type Recipe = InferSelectModel<typeof recipes>;
export type InsertRecipe = InferInsertModel<typeof recipes>;

export const recipesRelations = relations(recipes, ({ many, one }) => ({
    images: many(images),
    user: one(users, { fields: [recipes.user], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    recipes: many(recipes),
}));
