import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NuxtAuthHandler } from "#auth";

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
    ],
});
