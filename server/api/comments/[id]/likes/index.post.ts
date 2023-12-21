import { likedComments, InsertLikedComments } from "~/database/auth";

/*


---- THIS file can be deleted, (I tested it, but not 100% sure - so if you can test )


export default defineEventHandler(async (event) => {

  //check id comment exists
  if (!event.context.params)
    throw createError({ statusCode: 400, message: "ID is not defined" });
  const id = event.context.params.id as string;
  if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });

  const commentToPost = await readBody(event);
  console.log("in likes/index.post.ts")
  console.log(commentToPost)

  const result = await database.query.comments.findFirst({
    where: (comment, { eq }) => eq(comment.comment, commentToPost.comment),
    with: {
      replies: { with: { user: { columns: { name: true, id: true } } } },
    },
  });

  if (!result) {
    throw createError({
      statusCode: 400,
      message: "Comment to like on not found",
    });
  }

  //check id user exists
  await authenticate(event, () => {
    return commentToPost.user;
  });

  const putLikedComment = async (likedComment: InsertLikedComments) => {
    return database.insert(likedComments).values(likedComment);
  };
  await putLikedComment(commentToPost);
  return true;
});

*/
