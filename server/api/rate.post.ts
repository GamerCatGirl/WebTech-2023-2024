import { and, eq, sql } from "drizzle-orm";
import { ValiError, parse } from "valibot";
import { Rating, rateSchema, ratings, recipes } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    const user = await authenticate(event);

    const body = await readBody(event);
    let newRating: Rating;
    try {
        newRating = { ...parse(rateSchema, body, { abortEarly: true }), user };
    } catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }

    const recipe = await database.query.recipes.findFirst({ where: eq(recipes.id, body.recipe) });
    if (!recipe) throw createError({ statusCode: 404, message: "Recipe with ID '" + body.recipe + "' does not exist." });
    const recipeRating = recipe.score;

    const currentRating = await database.query.ratings.findFirst({
        where: and(eq(ratings.recipe, body.recipe), eq(ratings.user, user)),
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
                .where(and(eq(ratings.recipe, body.recipe), eq(ratings.user, user)));
        } else await tx.insert(ratings).values(newRating);
        await tx.update(recipes).set({ score: newRecipeAverage, ratings: ratedAmount }).where(eq(recipes.id, body.recipe));
    });
    return newRecipeAverage;
});
