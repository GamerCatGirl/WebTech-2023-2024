export default defineEventHandler((event) => {
    const query = getQuery(event);
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id;
    const recipeName = query.name?.valueOf();

    return database.query.recipes.findMany({
        where: (recipe, { and, eq, like }) =>
            recipeName ? and(eq(recipe.user, id), like(recipe.name, recipeName.toString())) : eq(recipe.user, id),
    });
});
