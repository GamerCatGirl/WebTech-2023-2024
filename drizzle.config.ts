import type { Config } from "drizzle-kit";

export default {
    schema: "./database/schema.ts",
    out: "./drizzle",
    driver: "better-sqlite",
    // Ignore the tables used for `fts`
    // `fts` is a `sqlite` extension that allows for full text search
    // This is ignored because it is not supported by Drizzle
    tablesFilter: ["!*_fts*"],
    dbCredentials: {
        url: process.env.DATABASE_URL || "./sqlite.db",
    },
} satisfies Config;
