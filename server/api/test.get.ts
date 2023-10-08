import { test } from "@/database/schema";

export default defineEventHandler(async (event) => {
    const result = database.select().from(test).all();
    return result;
});
