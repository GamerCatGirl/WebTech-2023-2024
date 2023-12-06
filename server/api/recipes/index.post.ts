import { recipes, InsertRecipe } from "~/database/recipe";

export default defineEventHandler(async (event) => {
  // TODO: Form validation
  // using e.g. ZOD: https://orm.drizzle.team/docs/zod/
  const putRecipe = async (recipe: InsertRecipe) => {
    return database.insert(recipes).values(recipe);
  };

  const body = await readBody(event);

  console.log(body); 
  await putRecipe(body);

  return { body };
});
