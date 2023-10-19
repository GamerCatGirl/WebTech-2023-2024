import { beforeEach, expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
import { seedData } from "../../seed/seedData";
import { seed } from "../../seed/seed";

await setup({});

beforeEach(async () => {
    await seed(seedData);
});

test("`/api/recipes` returns the recipes", async () => {
    const recipes = await $fetch("/api/recipes");
    expect(recipes).toStrictEqual(seedData.recipes);
});

test("`/api/recipes/<ID>` returns the recipe", async () => {
    for (const recipe of seedData.recipes) {
        const received = await $fetch(`/api/recipes/${recipe.id}`);
        expect(received, `recipe with ID '${recipe.id}'`).toStrictEqual({
            ...recipe,
            images: seedData.images.filter(({ recipe: recipeId }) => recipeId == recipe.id),
        });
    }
});
