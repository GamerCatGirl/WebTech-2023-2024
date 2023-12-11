<template>
    <RecipeEdit :recipe-id="id" />
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const route = useRoute();
const id = route.params.id;
definePageMeta({ middleware: "auth" });
const { data } = useAuth();

const { data: recipe } = await useFetch(`/api/recipes/${id}`);
const toast = useToast();
const nuxtApp = useNuxtApp();
if (!recipe.value)
    setTimeout(() => {
        toast.add({
            severity: "error",
            detail: `Recipe with ID '${id}' doesn't exist.`,
            life: 3000,
        });
        nuxtApp.runWithContext(async () => await navigateTo("/recipes"));
    }, 100);
else if (recipe.value && data.value?.user?.id !== recipe.value.user)
    setTimeout(() => {
        toast.add({
            severity: "error",
            detail: "You are not allowed to edit this recipe.",
            life: 3000,
        });
        nuxtApp.runWithContext(async () => await navigateTo(`/recipes/${id}`));
    }, 100);
</script>
