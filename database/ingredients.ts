import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipe";
import crypto from "crypto"

export const ingredients = sqliteTable("ingredients", {
    id: text("id")
    	.primaryKey()
    	.$defaultFn(() => crypto.randomUUID()),
    recipyId: text("recipyId").notNull(),
    ingredient: text("ingredient"),
    amount: integer("amount"),
    type: text("type"),
    category: text("category"),
});

export type ingredientsDB = InferSelectModel<typeof ingredients>;
export type InsertIngredients = InferInsertModel<typeof ingredients>;

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, { fields: [ingredients.recipyId], references: [recipes.id] }),
}));
