<template>
    <input v-model="input" type="text" placeholder="Search recipes..." />
    <ul>
        <li v-for="recipe in recipes" :key="recipe.id ?? 0">
            <div>
                <p>
                    <template v-for="(name, index) in recipe.nameList" :key="index">
                        <b v-if="index % 2 == 1">{{ name }}</b>
                        <template v-else>{{ name }}</template>
                    </template>
                </p>
                <template v-for="(description, index) in recipe.descList" :key="index">
                    <b v-if="index % 2 == 1">{{ description }}</b>
                    <template v-else>{{ description }}</template>
                </template>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { LocationQuery } from "vue-router";

const input = ref("");
const route = useRoute();
const queryParams = route.query;
const props = defineProps<{
    query?: string;
    page?: number;
    pageSize?: number;
}>();
const query = props.query ?? ((queryParams.query?.valueOf() as string) || "");
const page = props.page ?? (parseInt(queryParams.page?.valueOf() as string) || 0);
const pageSize = props.pageSize ?? (parseInt(queryParams.pageSize?.valueOf() as string) || 20);
const { data } = await useFetch("/api/recipes", {
    query: { search: query, page, size: pageSize, highStart: "<b>", highEnd: "</b>" },
});
const recipes = ref(
    data.value?.map((recipe) => {
        const nameList = recipe.name.split(/<\/?b>/);
        const descList = recipe.description.split(/<\/?b>/);
        return { ...recipe, nameList, descList };
    })
);
input.value = query;

let debounceTimeout: NodeJS.Timeout;
watch(input, () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        const queryParams: LocationQuery = {};
        if (input.value) queryParams.query = input.value;
        if (page && page !== 0) queryParams.page = page.toString();
        if (pageSize && pageSize !== 20) queryParams.pageSize = pageSize.toString();
        navigateTo({ path: route.path, query: queryParams, replace: true });
        const { data } = await useFetch("/api/recipes", {
            query: { search: input.value, page, size: pageSize, highStart: "<b>", highEnd: "</b>" },
        });
        recipes.value = data.value?.map((recipe) => {
            const nameList = recipe.name.split(/<\/?b>/);
            const descList = recipe.description.split(/<\/?b>/);
            return { ...recipe, nameList, descList };
        });
    }, 500);
});
</script>

<style>
ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
}
</style>
