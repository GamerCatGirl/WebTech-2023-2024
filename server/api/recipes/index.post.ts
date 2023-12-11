import { ValiError, parse } from "valibot";
import { getServerSession } from "#auth";
import { recipes, InsertRecipe, insertRecipeSchema } from "~/database/recipe";
import { InsertIngredients, ingredients, insertIngredientSchema } from "~/database/ingredients";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) throw createError({ statusCode: 401, statusMessage: "You need to be logged in to create new recipes." });
    if (!session.user)
        throw createError({ statusCode: 401, statusMessage: "You need to be logged in to create new recipes." });

    const body = await readBody(event);
    let recipe: InsertRecipe;
    let insertIngredients: InsertIngredients[] = [];
    try {
        recipe = { ...parse(insertRecipeSchema, body, { abortEarly: true }), user: session.user.id };
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, statusMessage: e.message });
        else throw e;
    }
    const [{ id }] = await database.insert(recipes).values(recipe).returning({ id: recipes.id });

    if (!(body.ingredients instanceof Array))
        throw createError({ statusCode: 400, statusMessage: "Please specify an array of ingredients." });
    if (body.ingredients.length === 0)
        throw createError({ statusCode: 400, statusMessage: "Please specify some ingredients." });

    try {
        insertIngredients = body.ingredients.map((ingredient: any) => {
            if (ingredient.id || ingredient.id === 0)
                throw createError({ statusCode: 400, statusMessage: "Please do not specify an ID for new ingredients." });
            return { ...parse(insertIngredientSchema, ingredient), recipyId: id };
        });
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, statusMessage: e.message });
        else throw e;
    }
    console.log(insertIngredients);
    await database.insert(ingredients).values(insertIngredients);
    return id;
});
