<script setup lang="ts">
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { Meal, Difficulty } from "~/composables/recipes";
import { Recipe } from "~/database/recipe";

function getParamArray(array: LocationQueryValue | LocationQueryValue[] | undefined): LocationQueryValue[] {
    if (!array) return [];
    else if (Array.isArray(array)) return array;
    else return [array];
}

const route = useRoute();
const queryParams = route.query;
const query = (queryParams.query?.valueOf() as string) || "";
const page = parseInt(queryParams.page?.valueOf() as string) || 0;
const mealTypes = getParamArray(queryParams.mealType) as Meal[];
const mealDifficulties = getParamArray(queryParams.mealDifficulty) as Difficulty[];

/** [TODO:description] */
function updateQueryParams(queryParams: LocationQuery) {
    navigateTo({ path: route.path, query: queryParams, replace: true });
}

function getRecipes(
    query: Ref<String>,
    page: Ref<Number>,
    size: Number,
    difficulty: Ref<Difficulty[]>,
    mealType: Ref<Meal[]>
) {
    const { data } = useFetch("/api/recipes", {
        query: {
            query,
            page,
            size,
            difficulty,
            mealType,
            highStart: "<b>",
            highEnd: "</b>",
        },
    });
    return computed(() => {
        return (
            {
                recipes: (data.value?.valueOf() as Recipe[]) || [],
                totalAmount: (data.value?.valueOf() || [])[0]?.totalAmount || 0,
            } ?? { recipes: [], totalAmount: 0 }
        );
    });
}
</script>
<template>
    <recipes-list
        :get-recipes="getRecipes"
        :highlight-matches="true"
        :initial-query="query"
        :initial-page="page"
        :initial-meal-types="mealTypes"
        :initial-meal-difficulties="mealDifficulties"
        @query-parameters-changed="updateQueryParams"
    />
</template>
