import { and, eq } from "drizzle-orm";
import { ratings, recipes } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    const user = await authenticate(event);

    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const recipeID = event.context.params.id as string;

    const recipe = await database.query.recipes.findFirst({ where: eq(recipes.id, recipeID) });
    if (!recipe) throw createError({ statusCode: 404, message: "Recipe with ID '" + recipeID + "' does not exist." });
    const recipeRating = recipe.score;

    const currentRating = await database.query.ratings.findFirst({
        where: and(eq(ratings.recipe, recipeID), eq(ratings.user, user)),
    });

    let ratedAmount = recipe.ratings;
    let newRecipeAverage = recipeRating;

    if (currentRating) {
        if (ratedAmount === 1) {
            ratedAmount = 0;
            newRecipeAverage = 0;
        } else {
            newRecipeAverage = (newRecipeAverage * ratedAmount - currentRating.rating) / (ratedAmount - 1);
            ratedAmount -= 1;
        }
    }

    await database.transaction(async (tx) => {
        if (currentRating) await tx.delete(ratings).where(and(eq(ratings.recipe, recipeID), eq(ratings.user, user)));
        await tx.update(recipes).set({ score: newRecipeAverage, ratings: ratedAmount }).where(eq(recipes.id, recipeID));
    });
    return newRecipeAverage;
});
