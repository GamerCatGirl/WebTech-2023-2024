import { usersDB } from "@/database/users";

export default defineEventHandler(async (event) => {
    const result = database.select().from(usersDB).all();
    return result;
});