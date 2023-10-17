import { beforeEach, expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

// Setup database
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as recipe from "../../database/recipe";
import * as auth from "../../database/auth";
import Database from "better-sqlite3";
import { seed } from "../data";

const sqlite = new Database("test/sqlite.db");
const database = drizzle(sqlite, { schema: { ...recipe, ...auth } });

await setup({});

beforeEach(async () => {
    await database.transaction(async (tx) => {
        await tx.delete(recipe.images);
        await tx.delete(recipe.recipes);
        await tx.delete(auth.users);
        await tx.delete(auth.accounts);
        await tx.delete(auth.sessions);
        await tx.delete(auth.verificationTokens);
    });
    await database.transaction(async (tx) => {
        await tx.insert(auth.users).values(seed.users);
        await tx.insert(recipe.recipes).values(seed.recipes);
        await tx.insert(recipe.images).values(seed.images);
    });
});

test("`/api/recipes` returns the recipes", async () => {
    const recipes = await $fetch("/api/recipes");
    expect(recipes).toStrictEqual(seed.recipes);
});

test("`/api/recipes/<ID>` returns the recipe", async () => {
    for (const recipe of seed.recipes) {
        const received = await $fetch(`/api/recipes/${recipe.id}`);
        expect(received, `recipe with ID '${recipe.id}'`).toStrictEqual({
            ...recipe,
            images: seed.images.filter(({ recipe: recipeId }) => recipeId == recipe.id),
        });
    }
});
