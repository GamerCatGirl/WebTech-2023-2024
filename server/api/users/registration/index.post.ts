import { InsertUsersWithCredentials, usersWithCredentials, insertNewUserCredsSchema } from "~/database/usersWithCredentials";
import { InsertUsers, users, usersDB, insertNewUserSchema } from "~/database/auth"
import crypto from "crypto";
import { ValiError, parse } from "valibot";

export default defineEventHandler(async (event) => {
    const randomUniqueId = crypto.randomUUID();

    /**Checks the validity of the user input.
     * @returns Object: if the input is valid
     * @returns Error: if the input is invalid
     */
    async function checkUserInput(userFromClient: InsertUsers) {
        const filledUser: InsertUsers = await putUser(userFromClient);
        const userObject: InsertUsers = { ...parse(insertNewUserSchema, filledUser), id: filledUser.id }
        return userObject;
    }

    /**Checks the validity of the user input.
    * @returns Object: if the input is valid
    * @returns Error: if the input is invalid
    */
    async function checkPassword(userFromClient: InsertUsersWithCredentials) {
        const filledUser: InsertUsersWithCredentials = await putUserWithCreds(userFromClient);
        const userObject: InsertUsersWithCredentials = { ...parse(insertNewUserCredsSchema, filledUser) };
        userObject.password = await hash(userObject.password);
        return userObject;
    }

    const putUser = async (userFromClient: InsertUsers) => {
        const userObject: InsertUsers = {
            id: randomUniqueId,
            email: userFromClient.email,
            name: userFromClient.name,
            image: userFromClient.image,
            country: userFromClient.country
        }
        return userObject;
    }
    const putUserWithCreds = (userFromClient: InsertUsersWithCredentials) => {
        const userWithCredsObject: InsertUsersWithCredentials = {
            id: randomUniqueId,
            password: userFromClient.password,
        }
        return userWithCredsObject;
    };

    async function pushInDatabase1(user: InsertUsers) {
        return await database.insert(users).values(user);
    }
    async function pushInDatabase2(userCreds: InsertUsersWithCredentials) {
        return await database.insert(usersWithCredentials).values(userCreds);
    }

    try {
        const body = await readBody(event);
        const userParsed: InsertUsers = await checkUserInput(body);
        const userWithCredsParsed: InsertUsersWithCredentials = await checkPassword(body);
        await pushInDatabase1(userParsed);
        await pushInDatabase2(userWithCredsParsed);
    }
    catch (e) {
        if (e instanceof ValiError) throw createError({ statusCode: 400, message: e.message });
        else throw e;
    }
});