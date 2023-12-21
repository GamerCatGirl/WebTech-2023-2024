export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }
    const id = event.context.params.id;

    const user = await database.query.users
        .findFirst({
            where: (user, { eq }) => eq(user.id, id),
            columns: { id: true, name: true, image: true},
        })
        .execute();

    if (user) return user;
    else
        throw createError({
            statusCode: 404,
            message: "The user with ID '" + id + "' does not exist.",
        });
});
