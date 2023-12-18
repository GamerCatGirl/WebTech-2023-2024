import { InsertUsersWithCredentials, usersWithCredentials } from "~/database/usersWithCredentials";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
    const putUser = async (user: InsertUsersWithCredentials) => {
        const userObject: InsertUsersWithCredentials = {
            id: crypto.randomUUID(),
            name: user.name,
            password: await hash(user.password),
            email: user.email,
            //TODO: let user chose picture
            image: null,
            country: user.country

        }
        return database.insert(usersWithCredentials).values(userObject);
    };

    const body = await readBody(event);
    await putUser(body);

    return { body };
});