import { recipes, InsertRecipe } from "~/database/recipe";

export default defineEventHandler(async (event) => {
  const putRecipe = async (recipe: InsertRecipe) => {
    return database.insert(recipes).values(recipe);
  };

  const body = await readBody(event);
  await putRecipe(body);

  return { body };
});
