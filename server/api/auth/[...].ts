// import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NuxtAuthHandler } from "#auth";

//import { db } from "./schema"

export default NuxtAuthHandler({
    pages: {
        signIn: '/register'
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
