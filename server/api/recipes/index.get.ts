import { recipes } from "@/database/recipe";

export default defineEventHandler(async (_) => {
    return database.select().from(recipes).all();
});
