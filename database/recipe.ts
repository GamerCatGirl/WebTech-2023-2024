import crypto from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, sqliteView, real, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, number, string, toTrimmed, undefined_, minValue, enum_, maxValue, optional } from "valibot";
import { Meal, Difficulty } from "../composables/recipes";
import { users } from "./auth";
import { ingredients } from "./ingredients";

////////// Comments ///////////
export const comments = sqliteTable("comment", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    comment: text("comment").notNull(),
    likes: integer("likes"),
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

///// LIKED comments ///// 
export const likedComments = sqliteTable("liked comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dislike: integer("dislike"),
  user: text("user_id")
    .references(() => users.id)
    .notNull(),
  comment: text("comment_id")
    .references(() => comments.id)
    .notNull(),
})

export type LikedComments = InferSelectModel<typeof likedComments>;
export type InsertLikedComments = InferInsertModel<typeof likedComments>;

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
	latitude: real("latitude").notNull(),
	longitude: real("longitude").notNull(),
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
    ratings: integer("ratings").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const ratings = sqliteTable(
    "rating",
    {
        recipe: text("recipe")
            .references(() => recipes.id)
            .notNull(),
        user: text("user")
            .references(() => users.id)
            .notNull(),
        rating: integer("rating").notNull(),
    },
    (ratings) => {
        return { pk: primaryKey(ratings.recipe, ratings.user) };
    }
);

export type Rating = InferSelectModel<typeof ratings>;

export const rateSchema = createInsertSchema(ratings, {
    recipe: string("Please specify the recipe you are trying to rate."),
    user: undefined_("Please do not specify the user."),
    rating: number("Please specify your rating.", [
        minValue(0, "Please do not give a score lower than 0."),
        maxValue(5, "Please do not give a score higher than 5"),
    ]),
});

export type Recipe = InferSelectModel<typeof recipes>;
export type InsertRecipe = InferInsertModel<typeof recipes>;

export const insertRecipeSchema = createInsertSchema(recipes, {
    id: undefined_("No ID should be specified."),
    name: string("Please give a name to your recipe", [
        toTrimmed(),
        minLength(5, "The name of your recipe should be longer than 5 characters"),
    ]),
	latitude: number("Please specify the latitude."),
	longitude: number("Please specify the longitude."),
    description: string("Please add a description.", [
        toTrimmed(),
        minLength(10, "Your description should be at least 10 characters long."),
    ]),
    recipe: string("Please add your recipe.", [toTrimmed(), minLength(50, "Your recipe is not long enough.")]),
    time: number("Please specify the required time.", [minValue(1, "Please specify the required time.")]),
    user: undefined_("No user should be specified."),
    thumbnail: string("Please specify a thumbnail."),
    type: enum_(Meal, "Please select a valid meal type."),
    difficulty: enum_(Difficulty, "Please select a valid difficulty."),
    score: undefined_("Score should not be specified."),
    ratings: undefined_("The amount of ratings should not be defined"),
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
