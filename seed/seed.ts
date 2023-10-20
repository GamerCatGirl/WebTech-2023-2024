import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../database/schema";

export const seed = async (seedData: any) => {
    const databaseUrl = process.env.DATABASE_URL ?? "./sqlite.db";
    const sqlite = new Database(databaseUrl);
    const database = drizzle(sqlite, { schema });
    await database.transaction(async (tx) => {
        for (const tableName in seedData) {
            // @ts-ignore
            await tx.insert(schema[tableName]).values(seedData[tableName]);
        }
    });
};
