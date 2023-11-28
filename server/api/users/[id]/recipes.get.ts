export default defineEventHandler((event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID is not defined",
        });
    }
    const id = event.context.params.id;

    return database.query.recipes.findMany({ where: (recipe, { eq }) => eq(recipe.user, id) });
});
