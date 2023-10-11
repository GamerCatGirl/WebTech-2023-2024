import { drizzle } from "drizzle-orm/better-sqlite3";
import * as recipe from "@/database/recipe";
import * as auth from "@/database/auth";
import Database from "better-sqlite3";

export const sqlite = new Database(process.env.DATABASE_URL || "./sqlite.ts");
export const database = drizzle(sqlite, { schema: { ...recipe, ...auth } });
