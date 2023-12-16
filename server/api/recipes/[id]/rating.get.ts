export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const recipeID = event.context.params.id as string;

    const query = getQuery(event);
    if (!query.user) throw createError({ statusCode: 400, message: "`user` is not defined." });
    const userID = query.user.valueOf() as string;

    const rating = await database.query.ratings.findFirst({
        where: ({ recipe, user }, { eq, and }) => and(eq(recipe, recipeID), eq(user, userID)),
    });
    if (rating) return rating.rating;
    else return false;
});
