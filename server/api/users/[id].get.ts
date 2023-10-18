export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            statusMessage: "ID is not defined",
        });
    }
    const id = event.context.params.id;

    return database.query.users.findFirst({ where: (user, { eq }) => eq(user.id, id)});
});