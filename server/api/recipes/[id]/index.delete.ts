import { eq } from "drizzle-orm";
import { recipes } from "~/database/recipe";

export default defineEventHandler(async (event) => {
    // Make sure that the ID exists
    if (!event.context.params) throw createError({ statusCode: 400, message: "ID is not defined" });
    const id = event.context.params.id as string;
    if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });

    await authenticate(event, async () => {
        // Get the recipe the user wants to edit
        const recipe = await database.query.recipes.findFirst({
            where: ({ id: recipeID }, { eq }) => eq(recipeID, id),
            with: { ingredients: true },
        });
        if (!recipe) throw createError({ statusCode: 400, message: `Cannot find recipe with ID: '${id}'` });
        return recipe.user;
    });

    await database.delete(recipes).where(eq(recipes.id, id));
    return true;
});
