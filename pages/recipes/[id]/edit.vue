<template>
    <RecipeEdit :recipe-id="id" />
</template>

<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const route = useRoute();
const id = route.params.id;
definePageMeta({ middleware: "auth" });
const headers: HeadersInit = useRequestHeaders(["cookie"]);
const { data } = await useFetch(`/api/recipes/${id}/canEdit`, { headers });
if (!data.value) {
    const toast = useToast();
    setTimeout(() => {
        toast.add({
            severity: "error",
            detail: "You are not allowed to edit this recipe.",
            life: 3000,
        });
        navigateTo(`/recipes/${id}`);
    }, 100);
}
</script>
