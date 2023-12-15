import { ValiError, parse } from "valibot";
import { getServerSession } from "#auth";
import { recipes, InsertRecipe, insertRecipeSchema } from "~/database/recipe";
import { InsertIngredients, ingredients, insertIngredientSchema } from "~/database/ingredients";
import { getUnit } from "@/composables/unit";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) throw createError({ statusCode: 401, message: "You need to be logged in to create new recipes." });
    if (!session.user) throw createError({ statusCode: 401, message: "You need to be logged in to create new recipes." });

    const body = await readBody(event);
    let recipe: InsertRecipe;
    let insertIngredients: InsertIngredients[] = [];
    try {
        recipe = { ...parse(insertRecipeSchema, body, { abortEarly: true }), user: session.user.id };
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }
    const [{ id }] = await database.insert(recipes).values(recipe).returning({ id: recipes.id });

    if (!(body.ingredients instanceof Array))
        throw createError({ statusCode: 400, message: "Please specify an array of ingredients." });
    if (body.ingredients.length === 0)
        throw createError({ statusCode: 400, message: "Please specify some ingredients." });

    try {
        insertIngredients = body.ingredients.map((ingredient: any) => {
            if (ingredient.id || ingredient.id === 0)
                throw createError({ statusCode: 400, message: "Please do not specify an ID for new ingredients." });
            const unit = getUnit(ingredient.unit);
            if (unit) ingredient.unit = unit;
            return { ...parse(insertIngredientSchema, ingredient), recipyId: id };
        });
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }
    await database.insert(ingredients).values(insertIngredients);
    return id;
});
