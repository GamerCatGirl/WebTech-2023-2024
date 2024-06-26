import { eq } from "drizzle-orm";
import { parse } from "valibot";
import { InsertUsers, users, usersDB, insertUserSchema } from "~/database/auth";

export default defineEventHandler(async (event) => {
    let user: usersDB | undefined;
    const id = event.context.params.id as string;
    if (!id) throw createError({ statusCode: 400, message: "ID is not defined" });

    const userID = await authenticate(event, async () => {
        // @ts-ignore
        user = await database.query.users.findFirst({
            where: ((user, { eq }) => eq(user.id, id))
        });
        return user?.id ?? "";
    });

    if (!user) throw createError({ statusCode: 400, message: `Cannot find user with ID: '${userID}'` });

    const body = await readBody(event);
    if (body.name.length === 0) {
        throw createError({ statusCode: 400, message: "Please specify a valid username" });
    }
    if (body.country == null) {
        throw createError({ statusCode: 400, message: "Please chose a country" })
    }
    //ZORGT VOOR DE ERROR
    let updateUser: InsertUsers = { ...parse(insertUserSchema, body), id: userID }

    await database.transaction(async (tx) => {
        await tx.update(users).set(updateUser).where(eq(users.id, userID));
    });
    return updateUser;

});