import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/database/schema";
import Database from "better-sqlite3";

export const sqlite = new Database(process.env.DATABASE_URL || "./sqlite.db");
export const database = drizzle(sqlite, { schema: { ...schema } });
