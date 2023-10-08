import { expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

await setup({});
test("See if API is up and reachable", async () => {
    let isUp = await $fetch("/api/isup");
    expect(isUp).toBeTruthy();
});
