import { and, eq } from "drizzle-orm";
import { ValiError } from "valibot";
import { Rating, ratings, recipes } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    const user = await authenticate(event);

    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const recipeID = event.context.params.id as string;

    const body = await readBody(event);
    if ((!body && body !== 0) || typeof body !== "number")
        throw createError({ statusCode: 400, message: "Please specify your new rating for this recipe." });
    if (body < 0 || body > 5) throw createError({ statusCode: 400, message: "Please give a rating between 0 and 5." });
    let newRating: Rating;
    try {
        newRating = { recipe: recipeID, user, rating: body };
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }

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

    ratedAmount += 1;
    newRecipeAverage = newRecipeAverage + (newRating.rating - newRecipeAverage) / ratedAmount;

    await database.transaction(async (tx) => {
        if (currentRating) {
            await tx
                .update(ratings)
                .set({ rating: newRating.rating })
                .where(and(eq(ratings.recipe, recipeID), eq(ratings.user, user)));
        } else await tx.insert(ratings).values(newRating);
        await tx.update(recipes).set({ score: newRecipeAverage, ratings: ratedAmount }).where(eq(recipes.id, recipeID));
    });
    return newRecipeAverage;
});
