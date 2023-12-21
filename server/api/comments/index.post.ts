import { comments, InsertComment } from "~/database/recipe";

export default defineEventHandler(async (event) => {
  const putComments = async (comment: InsertComment) => {
    return database.insert(comments).values(comment);
  };

  const body = await readBody(event);

  //
  const userID = await authenticate(event, undefined);
  body.user = userID;

  if (body.comment == "") {
    throw createError({
      statusCode: 404,
      message: "Comment is empty",
    });
  }

  const recipeExists = await database.query.recipes.findFirst({
	  where: (recipe, {eq}) => eq(recipe.id, body.recipe)
  })

  if (!recipeExists){
	throw createError({statusCode: 404, message: "Recipe not found"})
  }

  if (body.commentAnswer) {
    const result = await database.query.comments.findFirst({
      where: (comment, { eq }) => eq(comment.id, body.replied),
      with: {
        replies: { with: { user: { columns: { name: true, id: true } } } },
      },
    });

    if (!result){
    	throw createError({statusCode:404, message: "Comment to reply on not found"})
    }
  }

  body.userId = body.user;

  await putComments(body);
  return true;
});
