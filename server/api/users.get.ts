import { usersDB } from "@/database/usersDB";

export default defineEventHandler(async (event) => {
    const result = database.select().from(usersDB).all();
    return result;
});