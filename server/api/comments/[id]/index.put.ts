import { comments } from "~/database/recipe";
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
	

  // TODO: add to current user that he liked it or disliked it;

  const updateComment = async (likesToUpdate) => {
    await database
      .update(comments)
      .set({ likes: likesToUpdate.toString() })
      .where(eq(comments.id, id));
  };

  updateComment(comment);
});
