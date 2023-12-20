import { comments } from "~/database/recipe";
import { likedComments } from "~/database/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // Make sure that the ID exists
  if (!event.context.params)
    throw createError({ statusCode: 400, message: "ID is not defined" });
  const id = event.context.params.id as string;
  if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });



  const comment = await database.query.comments.findFirst({where: eq(comments.id, id)})

  if (!comment){
	  throw createError({ statusCode: 404, message: "Comment does not exist"})
  }

  //check if user is logged in
  await authenticate(event, () => {return comment.userID});



 
  await database.delete(likedComments).where(eq(likedComments.comment, id));

  const replies = await database.query.comments.findMany({
    where: eq(comments.replied, id),
  });

  replies.map(async (comment) => {
    await database
      .delete(likedComments)
      .where(eq(likedComments.comment, comment.id)); //this worked
  });

  //return replies;
  await database.delete(comments).where(eq(comments.replied, id));

  await database.delete(comments).where(eq(comments.id, id));

  return true;
});
