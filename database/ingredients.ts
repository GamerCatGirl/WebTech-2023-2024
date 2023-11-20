import { createId } from "@paralleldrive/cuid2";
import { InferInsertModel, InferSelectModel} from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipe";

export const ingredients = sqliteTable("ingredients", {
	id: text("id")
		.primaryKey(),
	//	.$defaultFn(() => createId()),
	recipyId: text("recipyId") //nog linken met andere tabel
		//.references(() => recipes.id)
		.notNull(),
	ingredient: text("ingredient"),
	amount: integer("amount"),
	type: text("type"),
	category: text("category"),
  });

export type ingredientsDB = InferSelectModel<typeof ingredients>;
export type InsertIngredients = InferInsertModel<typeof ingredients>;

//don't understand the relatsions 
