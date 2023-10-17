<script setup lang="ts">
const { data } = await useFetch("/api/test");
</script>

<template>
    <div>
        <title>Good Food</title>
        <pre>{{ data }}</pre>

        Home, a place where you belong! 
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
</style>
