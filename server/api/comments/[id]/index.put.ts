import { comments, likedComments, InsertLikedComments } from "~/database/recipe";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      message: "ID is not defined",
    });
  }
  const id = event.context.params.id;
  if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });

  // test if id exists
  const commentExists = await database.query.comments.findFirst({
    where: (comment, { eq }) => eq(comment.id, id),
  });

  if (!commentExists) {
    throw createError({ statusCode: 400, message: "Comment does not exist" });
  }

  const comment = await readBody(event);
  const user = await authenticate(event, undefined);


  comment.userThatLiked = user;
  console.log(comment);

  const updateComment = async (likesToUpdate) => {
    console.log(likesToUpdate);
    await database
      .update(comments)
      .set({ likes: likesToUpdate.toString() })
      .where(eq(comments.id, id));
  };

  const InsertLikedComment = async (data: InsertLikedComments) => {
    return database.insert(likedComments).values(data);
  };

  updateComment(comment.LikeAmount);

  let post: InsertLikedComments = {
    dislike: 0,
    user: comment.userThatLiked,
    comment: "" + id,
  };

  if (!comment.changeLike && !comment.cancel) {
    if (comment.dislike) {
      post.dislike = 1;
      InsertLikedComment(post);
    } else {
      InsertLikedComment(post);
    }

    // TODO: not tested yet
  } else if (comment.changeLike) {
    //comment change from like to dislike or the other way around
    console.log("change like");
    if (comment.dislike) {
      //change from like to dislike
      await database
        .update(likedComments)
        .set({ dislike: 1 })
        .where(
          and(
            eq(likedComments.comment, id),
            eq(likedComments.user, comment.userThatLiked),
          ),
        );
    } else {
      //change from dislike to like
      await database
        .update(likedComments)
        .set({ dislike: 0 })
        .where(eq(likedComments.comment, id));
    }
  } else if (comment.cancel) {
    //like is canceled
    console.log("cancel like");
    await database.delete(likedComments).where(eq(likedComments.comment, id));
  } else {
    return false;
  }

  return true;
});
