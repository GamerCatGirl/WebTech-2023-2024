import { InsertUsersWithCredentials, usersWithCredentials } from "~/database/usersWithCredentials";
import { InsertUsers, users } from "~/database/auth"
import crypto from "crypto";

export default defineEventHandler(async (event) => {
    const randomUniqueId = crypto.randomUUID();
    const putUser = async (userFromClient: InsertUsers) => {
        const userObject: InsertUsers = {
            id: randomUniqueId,
            email: userFromClient.email,
            name: userFromClient.name,
            image: userFromClient.image,
            country: userFromClient.country
        }
        return database.insert(users).values(userObject);
    }
    const putUserWithCreds = async (userFromClient: InsertUsersWithCredentials) => {
        const userWithCredsObject: InsertUsersWithCredentials = {
            id: randomUniqueId,
            password: await hash(userFromClient.password),
        }
        return database.insert(usersWithCredentials).values(userWithCredsObject);
    };

    const body = await readBody(event);
    await putUser(body);
    await putUserWithCreds(body);
});