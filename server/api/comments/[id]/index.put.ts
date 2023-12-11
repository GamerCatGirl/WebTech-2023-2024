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

  console.log("update comment")
  updateComment(comment.LikeAmount);

  const post = {
	  dislike: false,
	  user_id: comment.userThatLiked,
	  comment_id: id,
  }

 console.log("likedComments")
  if (!comment.changeLike && !comment.cancel){
	  console.log("new post ")
	  if (comment.dislike){
		  console.log("post dislike")
		  post.dislike = true; 
		  // TODO: post a dislike
		  database.insert(likedComments).values(post);
	  } else {
		  // TODO: post a like 
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







});
