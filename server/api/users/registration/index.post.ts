import { InsertUsers, users } from "~/database/auth";

export default defineEventHandler(async (event) => {
    const putUser = async (user: InsertUsers) => {
        return database.insert(users).values(user);
    };

    const body = await readBody(event);
    await putUser(body);

    console.log(body);

    return { body };
});