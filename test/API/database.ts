import { beforeEach, expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
import { seedData } from "../../seed/seedData";
import { seed } from "../../seed/seed";
import fs from "fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "../../database/schema";

await setup({});
const databaseUrl = process.env.DATABASE_URL ?? "./test/sqlite.db";

beforeEach(async () => {
    if (fs.existsSync(databaseUrl)) fs.rmSync(databaseUrl);
    const sqlite = new Database(databaseUrl);
    const database = drizzle(sqlite, { schema });
    migrate(database, { migrationsFolder: "./drizzle" });
    await seed(seedData);
});

test("`/api/recipes` returns the recipes", async () => {
    const recipes = await $fetch("/api/recipes");
    expect(recipes).toStrictEqual(seedData.recipes);
});

test("`/api/recipes/<ID>` returns the recipe", async () => {
    for (const recipe of seedData.recipes) {
        const received = await $fetch(`/api/recipes/${recipe.id}`);
        expect(received, `recipe with ID '${recipe.id}'`).toStrictEqual({ ...recipe });
    }
});
