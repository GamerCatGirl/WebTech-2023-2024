import { users } from "@/database/auth";

export default defineEventHandler(async (event) => {
    const result = database.select().from(users).all();
    return result;
});