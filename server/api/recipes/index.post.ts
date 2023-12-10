import { parse } from "valibot";
import { getServerSession } from "#auth";
import { recipes, InsertRecipe, insertRecipeSchema } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) throw createError({ statusCode: 401, statusMessage: "You need to be logged in to create new recipes." });

    const recipe = await readValidatedBody(event, (data) => parse(insertRecipeSchema, data));
    recipe.user = session.user?.id;
    recipe.score = 0;

    database.insert(recipes).values(recipe as InsertRecipe);
});
