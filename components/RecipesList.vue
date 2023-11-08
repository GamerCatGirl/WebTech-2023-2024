<template>
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
        <p v-if="recipes?.length == 0">No recipes found</p>
    </ul>
</template>

<script setup lang="ts">
const props = defineProps<{
    query: string;
    page: number;
    pageSize: number;
}>();
const recipes = ref(await getRecipes());
watch(
    () => props,
    async () => (recipes.value = await getRecipes()),
    { deep: true }
);

async function getRecipes() {
    const { data } = await useFetch("/api/recipes", {
        query: { search: props.query, page: props.page, size: props.pageSize, highStart: "<b>", highEnd: "</b>" },
    });
    return data.value?.map((recipe) => {
        const nameList = recipe.name.split(/<\/?b>/);
        const descList = recipe.description.split(/<\/?b>/);
        return { ...recipe, nameList, descList };
    });
}
</script>

<style>
ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
}
</style>
