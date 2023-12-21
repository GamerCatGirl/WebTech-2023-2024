import { comments, InsertComment } from "~/database/recipe";

export default defineEventHandler(async (event) => {
  const putComments = async (comment: InsertComment) => {
    return database.insert(comments).values(comment);
  };

  const body = await readBody(event);

  //
  await authenticate(event, () => {
    return body.user;
  });

  if (body.comment == "") {
    throw createError({
      statusCode: 404,
      message: "Comment is empty",
    });
  }

  if (body.replied) {
    const result = await database.query.comments.findFirst({
      where: (comment, { eq }) => eq(comment.id, body.replied),
      with: {
        replies: { with: { user: { columns: { name: true, id: true } } } },
      },
    });

    if (!result){
    	throw createError({statusCode:400, message: "Comment to reply on not found"})
    }
  }

  body.userId = body.user;

  await putComments(body);
  return true;
});
