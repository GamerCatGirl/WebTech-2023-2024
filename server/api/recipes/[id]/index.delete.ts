import { eq } from "drizzle-orm";
import { getServerSession } from "#auth";
import { recipes } from "~/database/recipe";

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

    console.log("hi there");
    await database.delete(recipes).where(eq(recipes.id, id));
});
