<template>
    <RecipeEdit />
</template>

<script>
definePageMeta({ middleware: "auth", navigateUnauthenticatedTo: "/login?callbackUrl=/recipes/add" });
</script>
