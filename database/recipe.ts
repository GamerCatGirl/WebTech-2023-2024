import crypto from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, sqliteView, real, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, number, string, toTrimmed, undefined_, minValue, enum_ } from "valibot";
import { Meal, Difficulty } from "../composables/recipes";
import { users } from "./auth";
import { ingredients } from "./ingredients";

////////// Comments ///////////
export const comments = sqliteTable("comment", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    comment: text("comment").notNull(),
    likes: text("likes"),
    // On what comment is this replying
    replied: text("replied").references(() => comments.id),
    userId: text("user")
        .references(() => users.id)
        .notNull(),
    recipe: text("recipe_id")
        .references(() => recipes.id)
        .notNull(),
});

export type Comment = InferSelectModel<typeof comments>;
export type InsertComment = InferInsertModel<typeof comments>;

///////////////////////////////
export const commentsRelations = relations(comments, ({ one, many }) => ({
    recipe: one(recipes, { fields: [comments.recipe], references: [recipes.id] }),
    replied: one(comments, { fields: [comments.replied], references: [comments.id], relationName: "replies" }),
    user: one(users, { fields: [comments.userId], references: [users.id] }),
    replies: many(comments, { relationName: "replies" }),
}));

const meals = Object.values(Meal).map((meal) => meal.toString());
const mealsTuple: [string, ...string[]] = [meals[0], ...meals.slice(1)];

const difficulty = Object.values(Difficulty).map((dificulty) => dificulty.toString());
const dificultyTuple: [string, ...string[]] = [difficulty[0], ...difficulty.slice(1)];

export const recipes = sqliteTable("recipe", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    location: text("location"),
    description: text("description").notNull(),
    // The actual recipe explanation
    recipe: text("recipe").notNull(),
    user: text("user")
        .references(() => users.id)
        .notNull(),
    thumbnail: text("thumbnail"),
    time: integer("time").notNull(),
    type: text("type", { enum: mealsTuple }).notNull(),
    difficulty: text("difficulty", { enum: dificultyTuple }).notNull(),
    score: real("score").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Recipe = InferSelectModel<typeof recipes>;
export type InsertRecipe = InferInsertModel<typeof recipes>;

export const insertRecipeSchema = createInsertSchema(recipes, {
    id: undefined_("No ID should be specified."),
    name: string("Please give a name to your recipe", [
        toTrimmed(),
        minLength(5, "The name of your recipe should be longer than 5 characters"),
    ]),
    location: string("Please specify a location."),
    description: string("Please add a description.", [
        toTrimmed(),
        minLength(10, "Your description should be at least 10 characters long."),
    ]),
    recipe: string("Please add your recipe.", [toTrimmed(), minLength(50, "Your recipe is not long enough.")]),
    time: number("Please specify the required time.", [minValue(1)]),
    user: undefined_("No user should be specified."),
    thumbnail: string("Please specify a thumbnail."),
    type: enum_(Meal, "Please select a valid meal type."),
    difficulty: enum_(Difficulty, "Please select a valid difficulty."),
    score: undefined_("Score should not be specified."),
    createdAt: undefined_("Creation date should not be specified."),
});

export const recipesRelations = relations(recipes, ({ many, one }) => ({
    ingredients: many(ingredients),
    comments: many(comments),
    user: one(users, { fields: [recipes.user], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    recipes: many(recipes),
    comments: many(comments),
}));

export const recipeFts = sqliteView("recipe_fts", {
    id: text("id"),
    name: text("name"),
    description: text("description"),
}).existing();
