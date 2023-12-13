import crypto from "crypto";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { enum_, minLength, minValue, notValue, number, optional, string, undefined_ } from "valibot";
import { UnitType } from "../composables/api";
import { recipes } from "./recipe";

export const ingredients = sqliteTable("ingredients", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    recipyId: text("recipyId").notNull(),
    ingredient: text("ingredient").notNull(),
    amount: integer("amount").notNull(),
    unit: text("unit").notNull(),
    unitType: text("unitType").notNull(),
    index: integer("order").notNull(),
    category: text("category").notNull(),
});

export type ingredientsDB = InferSelectModel<typeof ingredients>;
export type InsertIngredients = InferInsertModel<typeof ingredients>;

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, { fields: [ingredients.recipyId], references: [recipes.id] }),
}));

export const insertIngredientSchema = createInsertSchema(ingredients, {
    id: optional(string()),
    ingredient: string("Please specify your ingredient.", [minLength(1)]),
    amount: number("Please give an amount", [
        minValue(0, "Please specify an amount greater than 0."),
        notValue(0, "Please specify an amount greater than 0."),
    ]),
    recipyId: undefined_("Don't specify the recipeID."),
    index: number("Please specify the index of this ingredient", [minValue(0, "Please specify a postive index.")]),
    unit: string("Please specify the unit of your ingredient.", [minLength(1)]),
    unitType: enum_(UnitType, "Please specify the type of your unit"),
    category: string("Please specify the category of your ingredient.", [minLength(1)]),
});
