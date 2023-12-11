import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID is not defined",
        });
    }
    const id = event.context.params.id as string;

    const session = await getServerSession(event);
    // Make sure the user is authenticated
    if (!session || !session.user) return false;

    const user = await database.query.recipes.findFirst({
        where: (recipe, { eq }) => eq(recipe.id, id),
        columns: { user: true },
    });
    return user?.user === session.user.id;
});
