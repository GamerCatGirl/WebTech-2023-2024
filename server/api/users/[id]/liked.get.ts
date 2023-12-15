export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id;

    return await database.query.likedComments
        .findMany({
            where: (comment, { eq }) => eq(comment.user, id),
            columns: { comment: true, dislike: true },
        })
        .execute();
});
