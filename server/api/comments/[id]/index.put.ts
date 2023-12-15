import { comments } from "~/database/recipe";
import { likedComments, InsertLikedComments} from "~/database/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {

  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is not defined",
    });
  }
  const id = event.context.params.id;
  const comment = await readBody(event); 
	

  const updateComment = async (likesToUpdate) => {
    await database
      .update(comments)
      .set({ likes: likesToUpdate.toString() })
      .where(eq(comments.id, id));
  };

  const InsertLikedComment = async (data: InsertLikedComments) => {
	  return database.insert(likedComments).values(data);
  }

  const deleteLikedComment = 0;
  const changeLikedComment = 0;

  updateComment(comment.LikeAmount);

  let post: InsertLikedComments = {
	  dislike: 0,
	  user: comment.userThatLiked,
	  comment:"" +  id,
  }

  if (!comment.changeLike && !comment.cancel){
	  if (comment.dislike){
		  post.dislike = 1; 
		  InsertLikedComment(post)
	  } else {
		  InsertLikedComment(post)
	  }
  } else if (comment.changeLike){
	  console.log("change like");
	  if (comment.dislike){
		  // TODO: change dislike to true 
	  } else {
		  // TODO: change dislike to false
	  }
  } else if (comment.cancel){
	  console.log("cancel like");
	  // TODO: delete like/dislike from database 
  }

  console.log("done")







});
