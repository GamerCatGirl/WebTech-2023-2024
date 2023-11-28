import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, sqliteView } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./auth";
import { ingredients } from "./ingredients";

export const images = sqliteTable("image", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    url: text("url").notNull(),
    recipe: text("recipe_id")
        .references(() => recipes.id)
        .notNull(),
});

export type Image = InferSelectModel<typeof images>;
export type InsertImage = InferInsertModel<typeof images>;

export const imagesRelations = relations(images, ({ one }) => ({
    recipe: one(recipes, { fields: [images.recipe], references: [recipes.id] }),
}));

export const recipes = sqliteTable("recipe", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name").notNull(),
    location: text("location"),
    description: text("description"),
    user: text("user")
        .references(() => users.id)
        .notNull(),
    thumbnail: text("thumbnail"),
});

export type Recipe = InferSelectModel<typeof recipes>;
export type InsertRecipe = InferInsertModel<typeof recipes>;

export const recipesRelations = relations(recipes, ({ many, one }) => ({
    images: many(images),
    ingredients: many(ingredients),
    user: one(users, { fields: [recipes.user], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    recipes: many(recipes),
}));

export const recipeFts = sqliteView("recipe_fts", {
    id: text("id"),
    name: text("name"),
    description: text("description"),
}).existing();
