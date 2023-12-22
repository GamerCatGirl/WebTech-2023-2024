import crypto from "crypto";
import { getServerSession } from "#auth";
import { apiKey } from "~/database/auth";
import { hash } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) throw createError({ statusCode: 401, message: "You need to be logged in to create new API keys." });
    if (!session.user) throw createError({ statusCode: 401, message: "You need to be logged in to create new API keys." });

    const key = hash(crypto.randomUUID());
    const saveKey = hash(key);

    await database.insert(apiKey).values({ key: saveKey, user: session.user.id });
    return key;
});
