export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID is not defined",
        });
    }
    const id = parseInt(event.context.params.id) as number;
    if (!Number.isInteger(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID should be an integer",
        });
    }
    return database.query.recipes.findFirst({ where: (recipe, { eq }) => eq(recipe.id, id), with: { images: true } });
});
