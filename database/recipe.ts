import crypto from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, sqliteView, real, integer } from "drizzle-orm/sqlite-core";
import { Meal, Difficulty } from "../composables/recipes";
import { users } from "./auth";
import { ingredients } from "./ingredients";


//////IMAGES ////////////
export const images = sqliteTable("image", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    recipe: text("recipe_id")
        .references(() => recipes.id)
        .notNull(),
});

export type Image = InferSelectModel<typeof images>;
export type InsertImage = InferInsertModel<typeof images>;




////////// Comments ///////////
export const comments = sqliteTable("comment", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	comment: text("comment").notNull(),
	commentAnswer: text("answered on"),
	recipe: text("recipe_id")
		.references(() => recipes.id)
		.notNull(),
});

export type Comment = InferSelectModel<typeof comments>;
export type InsertComment = InferInsertModel<typeof comments>;



///////////////////////////////
export const imagesRelations = relations(images, ({ one }) => ({
    recipe: one(recipes, { fields: [images.recipe], references: [recipes.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	recipe: one(recipes, {fields: [comments.recipe], references: [recipes.id] }),
}))

const meals = Object.values(Meal).map((meal) => meal.toString());
const mealsTuple: [string, ...string[]] = [meals[0], ...meals.slice(1)];

const dificulty = Object.values(Difficulty).map((dificulty) => dificulty.toString());
const dificultyTuple: [string, ...string[]] = [dificulty[0], ...dificulty.slice(1)];

export const recipes = sqliteTable("recipe", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    location: text("location"),
    description: text("description"),
    user: text("user")
        .references(() => users.id)
        .notNull(),
    thumbnail: text("thumbnail"),
    time: integer("time"),
    type: text("type", { enum: mealsTuple }),
    difficulty: text("difficulty", { enum: dificultyTuple }),
    score: real("score"),
});

export type Recipe = InferSelectModel<typeof recipes>;
export type InsertRecipe = InferInsertModel<typeof recipes>;

export const recipesRelations = relations(recipes, ({ many, one }) => ({
    images: many(images),
    ingredients: many(ingredients),
    comments: many(comments),
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
