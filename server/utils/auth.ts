import crypto from "crypto";
import { H3Event, EventHandlerRequest } from "h3";
import { getServerSession } from "#auth";

const salt = "yxpOGDda72YdP6ZhJoZOWKEfrhta8eSknKG6DdMmkczyQAzDWEAD45y2lDuPm4dxNTfGQQGS4DLdX8aUV4oB5ghBPfixqhwv";

// https://stackoverflow.com/questions/18338890/are-there-any-sha-256-javascript-implementations-that-are-generally-considered-t/48161723#48161723
/**
 * Generate a secure has from a string.
 * This uses the `SHA-256` algorithm.
 *
 * @async
 * @param msg - The string to hash
 * @returns The hashed string
 */
export async function hash(msg: string) {
    // hash the message
    const hashBuffer = crypto.createHash("SHA-256").update(msg).update(salt).digest();

    // const msgBuffer = new TextEncoder().encode(msg);

    // const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    console.log("t", msg);
    // convert bytes to hex string
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Authenticate the user with a given session token
 *
 * @async
 * @param {H3Event<EventHandlerRequest>} event - The event containing the session token
 * @throws 401 - If the user is not authenticated, this will throw an error
 * @returns The user ID
 */
async function authenticateSession(event: H3Event<EventHandlerRequest>) {
    const session = await getServerSession(event);
    // Make sure the user is authenticated
    if (!session) throw createError({ statusCode: 401, message: "You need to be logged in to perform this action." });
    if (!session.user) throw createError({ statusCode: 401, message: "You need to be logged in to perform this action." });
    return session.user.id;
}

/**
 * Authenticate the user based on the given api key in the URL parameters
 *
 * @async
 * @param event - The event containing the URL parameters
 * @returns The user ID or undefined if no user was found
 */
async function authenticateApiKey(event: H3Event<EventHandlerRequest>) {
    const query = getQuery(event);
    if (!query || !query.apiKey) return undefined;
    const key = query.apiKey as string;
    const keyHash = await hash(key);
    const user = await database.query.apiKey.findFirst({
        where: ({ key }, { eq }) => eq(key, keyHash),
    });
    if (!user) return undefined;
    else return user.user;
}

/**
 * Authenticate the user.
 *
 * @async
 * @param event - The event
 * @param getUser - A function that returns the user ID that needs to be authenticated
 * @throws 401 - If the user is not authenticated, this will throw an error
 * @returns The authenticated user ID
 */
export async function authenticate(event: H3Event<EventHandlerRequest>, getUser?: () => Promise<string>) {
    const authUserID = (await authenticateApiKey(event)) ?? (await authenticateSession(event));

    if (getUser) {
        // Make sure that the user has access
        const userID = await getUser();
        if (userID !== authUserID)
            throw createError({ statusCode: 401, message: "You do not have access to this recipe." });
    }
    return authUserID;
}
