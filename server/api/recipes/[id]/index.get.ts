export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id as string;
    const recipe = await database.query.recipes
        .findFirst({
            where: (recipe, { eq }) => eq(recipe.id, id),
            with: {
                ingredients: { orderBy: ({ index }, { asc }) => [asc(index)] },
                comments: {
                    where: (comment, { eq, and, isNull }) => and(eq(comment.recipe, id), isNull(comment.replied)),
                    with: { user: { columns: { id: true, name: true } } },
                },
            },
        })
        .execute();
    if (recipe) return recipe;
    else throw createError({ statusCode: 404, message: "Recipe with id '" + id + "' does not exist" });
});
