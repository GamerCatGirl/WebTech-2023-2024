<script setup lang="ts">
import { LocationQuery, LocationQueryValue } from "vue-router";
import { Recipe } from "~/database/recipe";
import { Meal, Difficulty } from "~/composables/recipes";

const route = useRoute();
const id = route.params.id;
const { data: user } = await useFetch(`/api/users/${id}`);
if (!user)
    showError({
        statusCode: 404,
        message: "This user does not exist.",
    });

async function getUserRecipes(
    query: Ref<string>,
    page: Ref<number>,
    size: number,
    difficulty: Ref<Difficulty[]>,
    mealType: Ref<Meal[]>,
    sortOn: Ref<string>,
    sortOrder: Ref<number>
): Promise<Ref<{ recipes: (Recipe & { userName: string | undefined })[]; totalAmount: number }>> {
    const { data } = await useFetch("/api/recipes", {
        query: {
            query,
            page,
            size,
            difficulty,
            mealType,
            sortOn,
            user: id,
            sort: sortOrder,
            highStart: "<b>",
            highEnd: "</b>",
        },
        // A key is necessary here, because otherwise nuxt sends the request both on server-side and on client-side, resulting in a hydration mismatch
        key: "recipes",
    });
    return computed(() => {
        return (
            {
                recipes:
                    (data.value?.valueOf() as { recipes: (Recipe & { userName: string })[]; totalAmount: number })
                        ?.recipes || [],
                totalAmount: (data.value?.valueOf() as { recipes: Recipe; totalAmount: number })?.totalAmount || 0,
            } ?? { recipes: [], totalAmount: 0 }
        );
    });
}

/**
 * Make an array of `locationQuery` out of a variable that is either a singleton, an array or undefined.
 * If `array` is undefined, this returns the empty array, if `array` is a singleton, this returns an array with only that element inside of it, otherwise it just returns the array itself.
 *
 * @param array - The `locationQuery`
 * @returns An array of all `locationquerie`s inside of `array`
 */
function getParamArray(array: LocationQueryValue | LocationQueryValue[] | undefined): LocationQueryValue[] {
    if (!array) return [];
    else if (Array.isArray(array)) return array;
    else return [array];
}

const queryParams = route.query;
const query = (queryParams.query?.valueOf() as string) || "";
const page = parseInt(queryParams.page?.valueOf() as string) || 0;
const mealTypes = getParamArray(queryParams.type) as Meal[];
const mealDifficulties = getParamArray(queryParams.difficulty) as Difficulty[];

/** Change the URL to reflect the state of the `recipesList` */
function updateQueryParams(queryParams: LocationQuery) {
    navigateTo({ path: route.path, query: queryParams, replace: true });
}
</script>

<template>
    <div class="profile">
        <div class="profileInfo">
            <Avatar v-if="user?.image" :image="user?.image ?? ''" shape="circle" preview />
            <Avatar v-else icon="pi pi-user" class="mt-2" shape="circle" />
            <h1>{{ user?.name }}</h1>
        </div>
        <br />
        These are {{ user?.name }}'s recipes:
        <br />
        <div class="listDiv">
            <RecipesList
                :get-recipes="getUserRecipes"
                :page-size="5"
                class="recipesList"
                hide-username
                highlight-matches
                :initial-query="query"
                :initial-page="page"
                :initial-meal-types="mealTypes"
                :initial-meal-difficulties="mealDifficulties"
                @query-parameters-changed="updateQueryParams"
            />
        </div>
    </div>
</template>

<style scoped>
.profile {
    margin: 8px;
}

.profileInfo {
    display: flex;
    margin-top: 20px;
}

.profileInfo > .p-avatar {
    margin-top: 2px;
}

.profileInfo > h1 {
    margin: 0px;
    margin-left: 8px;
}

.recipesList {
    border: 1px solid var(--surface-100);
}
</style>
