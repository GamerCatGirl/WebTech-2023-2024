import { likedComments, InsertLikedComments } from "~/database/auth";

export default defineEventHandler(async (event) => {
  const commentToPost = await readBody(event);

  //check id comment exists

    const result = await database.query.comments.findFirst({
      where: (comment, { eq }) => eq(comment.comment, commentToPost.comment),
      with: {
        replies: { with: { user: { columns: { name: true, id: true } } } },
      }})

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
