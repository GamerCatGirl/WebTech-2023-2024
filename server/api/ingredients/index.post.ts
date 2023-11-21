import { ingredients, InsertIngredients } from "~/database/ingredients";

export default defineEventHandler(async (event) => {
  const putIngredients = async (ingredient: InsertIngredients) => {
    return database.insert(ingredients).values(ingredient);
  };

  const body = await readBody(event);
  await putIngredients(body);

  console.log(body);

  return { body };
});
