import { parse } from "valibot";
import { recipes, InsertRecipe, insertRecipeSchema } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    const putRecipe = (recipe: InsertRecipe) => {
        return database.insert(recipes).values(recipe);
    };

    const body = await readValidatedBody(event, (data) => parse(insertRecipeSchema, data));

    putRecipe(body);

    return { body };
});
