export default defineEventHandler(async (event) => {
    if (!event.context.params) {
        throw createError({
            statusCode: 400,
            message: "ID is not defined",
        });
    }

    const id = event.context.params.id as string; //id of comment 
    const result = await  database.query.comments.findFirst({
        where: (comment, { eq }) => eq(comment.id, id),
        with: { replies: { with: { user: { columns: { name: true, id: true } } } } },
    });
	
    if (!result){
	    throw createError({ statusCode: 400, message: "Comment does not exist"})
    }

    return result;
});
