import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NuxtAuthHandler } from "#auth";
import { users, usersWithCredentials } from "@/database/schema";
import { eq, isNotNull } from "drizzle-orm";

export default NuxtAuthHandler({
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.user = { id: user.id, name: user.name, image: user.image };
            }
            return token;
        },
        session: ({ session, token }) => {
            session.user = token.user;
            return session;
        },
    },
    session: {
        // JWT is used here, because AuthJS does not allow to use session tokens and the database when you are using the credentials provider
        strategy: "jwt",
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
        // @ts-expect-error
        CredentialsProvider.default({
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            name: "credentials",
            async authorize(credentials: any) {
                // logic for authenticating credentials from database
                // let user = null;
                const saltedPassword = hash(credentials.password);
                const user = await database
                    .select({ id: users.id, name: users.name })
                    .from(users)
                    .leftJoin(usersWithCredentials, eq(users.id, usersWithCredentials.id))
                    .where(isNotNull(usersWithCredentials.password))
                    .where(eq(credentials.username, users.name))
                    .where(eq(usersWithCredentials.password, saltedPassword));
                if (user.length === 1) {
                    return user[0];
                } else {
                    return null;
                }
            },
        }),
    ],
});
