import { recipes, InsertRecipe } from "~/database/recipe";

export default defineEventHandler(async (event) => {
  const putRecipe = async (recipe: InsertRecipe) => {
    return database.insert(recipes).values(recipe);
  };

  const body = await readBody(event);

  console.log(body); 
  await putRecipe(body);

  return { body };
});
