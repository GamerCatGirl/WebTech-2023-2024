import { ValiError, parse } from "valibot";
import { eq } from "drizzle-orm";
import { recipes, InsertRecipe, insertRecipeSchema } from "~/database/recipe";
import { InsertIngredients, ingredients as ingredientsTable, insertIngredientSchema } from "~/database/ingredients";
import { getServerSession } from "#auth";
import { getUnit } from "@/composables/unit";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    // Make sure the user is authenticated
    if (!session) throw createError({ statusCode: 401, message: "You need to be logged in to update recipes." });
    if (!session.user)
        throw createError({ statusCode: 401, message: "You need to be logged in to update recipes." });

    // Make sure that the ID exists
    if (!event.context.params) throw createError({ statusCode: 400, message: "ID is not defined" });
    const id = event.context.params.id as string;
    if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });

    // Get the recipe the user wants to edit
    const recipe = await database.query.recipes.findFirst({
        where: ({ id: recipeID }, { eq }) => eq(recipeID, id),
        with: { ingredients: true },
    });
    // Make sure that the user has access to this recipe
    if (!recipe) throw createError({ statusCode: 400, message: `Cannot find recipe with ID: '${id}'` });
    if (recipe.user !== session.user.id)
        throw createError({ statusCode: 401, message: "You do not have access to this recipe." });

    const body = await readBody(event);
    if (!(body.ingredients instanceof Array))
        throw createError({ statusCode: 400, message: "Please specify an array of ingredients." });
    if (body.ingredients.length === 0)
        throw createError({ statusCode: 400, message: "Please specify some ingredients." });

    let updateRecipe: InsertRecipe;
    const ingredients: InsertIngredients[] = recipe.ingredients;
    const updateIngredients: InsertIngredients[] = [];
    const insertIngredients: InsertIngredients[] = [];
    try {
        // parse recipe
        updateRecipe = { ...parse(insertRecipeSchema, body, { abortEarly: true }), user: session.user.id };

        // Find the ingredients that should be added, updated or removed
        for (const ingredient of body.ingredients) {
            const unit = getUnit(ingredient.unit);
            console.log(ingredient.unit, unit);
            if (unit) ingredient.unit = unit;
            const parsedIngredient = { ...parse(insertIngredientSchema, ingredient), recipyId: id };

            if (
                parsedIngredient.id &&
                ingredients.find(({ id }, index) => {
                    if (id === parsedIngredient.id) {
                        ingredients.splice(index, 1);
                        return true;
                    }
                    return false;
                })
            ) {
                updateIngredients.push(parsedIngredient);
            } else if (parsedIngredient.id)
                throw createError({ statusCode: 400, message: "Please do not specify an ID for new ingredients." });
            else insertIngredients.push(parsedIngredient);
        }
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }

    await database.transaction(async (tx) => {
        // Update recipe
        await tx.update(recipes).set(updateRecipe).where(eq(recipes.id, id));

        // Delete removed ingredients
        for (const { id } of ingredients) await tx.delete(ingredientsTable).where(eq(ingredientsTable.id, id ?? ""));

        // Update changed ingredients
        for (const ingredient of updateIngredients)
            await tx
                .update(ingredientsTable)
                .set(ingredient)
                .where(eq(ingredientsTable.id, ingredient.id ?? ""));
        // Insert new ingredients
        if (insertIngredients.length > 0) await tx.insert(ingredientsTable).values(insertIngredients);
    });
});
