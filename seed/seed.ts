import fs from "fs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as schema from "../database/schema";
import { sql } from "drizzle-orm";

export const seed = async (seedData: any, removeDrizzleMigrationsTable: boolean = false) => {
    const databaseUrl = process.env.DATABASE_URL ?? "./sqlite.db";
    if (fs.existsSync(databaseUrl)) fs.rmSync(databaseUrl);
    const sqlite = new Database(databaseUrl);
    const database = drizzle(sqlite, { schema });
    if (removeDrizzleMigrationsTable) migrate(database, { migrationsFolder: "./drizzle" });
    database.run(sql`DROP TABLE __drizzle_migrations`);
    await database.transaction(async (tx) => {
        for (const tableName in seedData) {
            // @ts-ignore
            await tx.insert(schema[tableName]).values(seedData[tableName]);
        }
    });
};
