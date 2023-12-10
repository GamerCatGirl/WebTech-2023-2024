import crypto from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { minLength, minValue, notValue, number, string } from "valibot";
import { recipes } from "./recipe";

export const ingredients = sqliteTable("ingredients", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    recipyId: text("recipyId").notNull(),
    ingredient: text("ingredient").notNull(),
    amount: integer("amount").notNull(),
    unit: text("unit").notNull(),
    category: text("category").notNull(),
});

export type ingredientsDB = InferSelectModel<typeof ingredients>;
export type InsertIngredients = InferInsertModel<typeof ingredients>;

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, { fields: [ingredients.recipyId], references: [recipes.id] }),
}));

export const insertIngredientSchema = createInsertSchema(ingredients, {
    ingredient: string("Please specify your ingredient.", [minLength(1)]),
    amount: number("Please give an amount", [
        minValue(0, "Please specify an amount greater than 0."),
        notValue(0, "Please specify an amount greater than 0."),
    ]),
    unit: string("Please specify the unit of your ingredient.", [minLength(1)]),
    category: string("Please specify the category of your ingredient.", [minLength(1)]),
});
