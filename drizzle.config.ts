import type { Config } from "drizzle-kit";

export default {
    schema: "./database/*",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: process.env.DATABASE_URL || "./sqlite.db",
    },
} satisfies Config;
