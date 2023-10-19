import { users } from "@/database/schema";

export default defineEventHandler(async (event) => {
    const result = database.select().from(users).all();
    return result;
});
