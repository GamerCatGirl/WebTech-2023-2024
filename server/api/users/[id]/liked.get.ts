import { and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id;
    const query = getQuery(event);
    if (query.comment) {
        const commentID = (query.comment?.valueOf() as string) ?? "";
        const comment = await database.query.likedComments
            .findFirst({
                where: (comment, { eq }) => and(eq(comment.user, id), eq(comment.comment, commentID)),
                columns: { comment: true, dislike: true },
            })
            .execute();
        return [comment];
    }

    return database.query.likedComments.findMany({
        where: (comment, { eq }) => eq(comment.user, id),
        columns: { comment: true, dislike: true },
    });
});
