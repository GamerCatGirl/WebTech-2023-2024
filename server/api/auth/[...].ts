import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NuxtAuthHandler } from "#auth";
import { users, usersWithCredentials } from "@/database/schema";
import { eq, isNotNull } from "drizzle-orm";

export default NuxtAuthHandler({
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session: ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    // @ts-expect-error
    adapter: DrizzleAdapter(database),
    providers: [
        // @ts-expect-error
        GoogleProvider.default({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // @ts-expect-error
        GitHubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        // @ts-expect-error
        FacebookProvider.default({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        //should allow users to login with username + password
        //@ts-ignore
        CredentialsProvider.default({
            credentials: {
                username: { label: "username", type: "string" },
                password: { label: "password", type: "string" }
            },
            async authorize(credentials) {
                //logic for authenticating credentials from database
                //let user = null;
                const saltedPassword = await hash(credentials.password);
                console.log(saltedPassword);
                const user = await database.select({ ...usersWithCredentials, id: users.id, name: users.name })
                    .from(users)
                    .leftJoin(usersWithCredentials, eq(users.id, usersWithCredentials.id))
                    .where(isNotNull(usersWithCredentials.password))
                    .where(eq(credentials.username, users.name))
                    .where(eq(saltedPassword, usersWithCredentials.password));
                if (user.length == 1) {
                    console.log("test1")
                    return user;
                } else {
                    console.log("test2")
                    return Error("user not found");
                }
            }
        })
    ]
});
