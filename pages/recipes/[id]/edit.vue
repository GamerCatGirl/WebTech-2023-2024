<template>
    <div>
        <RecipeEdit :edit-recipe="recipe" />
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
definePageMeta({ middleware: "auth" });
const { data } = useAuth();

const { data: recipe } = await useFetch(`/api/recipes/${id}`);
if (!recipe.value)
    showError({
        statusCode: 404,
        message: "This recipe does not exist.",
    });
else if (recipe.value && data.value?.user?.id !== recipe.value.user)
    showError({
        statusCode: 401,
        message: "You are not allowed to edit this recipe.",
    });
</script>
