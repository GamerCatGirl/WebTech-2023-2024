import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";
import { apiKey } from "~/database/auth";

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if (!session) throw createError({ statusCode: 401, message: "You need to be logged in to create new recipes." });
    if (!session.user) throw createError({ statusCode: 401, message: "You need to be logged in to create new recipes." });

    await database.delete(apiKey).where(eq(apiKey.user, session.user.id));

    return true;
});
