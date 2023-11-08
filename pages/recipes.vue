<template>
    <div>
        <input v-model="input" type="text" placeholder="Search recipes..." />
        <RecipesList :query="query" :page="page" :page-size="pageSize" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LocationQuery, useRoute } from "vue-router";

// import { LocationQuery } from "vue-router";

const input = ref("");
const route = useRoute();
const queryParams = route.query;
let query = (queryParams.query?.valueOf() as string) || "";
const page = parseInt(queryParams.page?.valueOf() as string) || 0;
const pageSize = parseInt(queryParams.pageSize?.valueOf() as string) || 20;
if (query) input.value = query;

let debounceTimeout: NodeJS.Timeout;
watch(input, () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        query = input.value;
        const queryParams: LocationQuery = {};
        if (input.value) queryParams.query = input.value;
        if (page && page !== 0) queryParams.page = page.toString();
        if (pageSize && pageSize !== 20) queryParams.pageSize = pageSize.toString();
        navigateTo({ path: route.path, query: queryParams, replace: true });
    }, 500);
});
</script>
