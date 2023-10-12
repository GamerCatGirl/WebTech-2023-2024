<script setup lang="ts">
const { data } = await useFetch("/api/test");
</script>

<template>
    <div>
        <title>Good Food</title>
        <pre>{{ data }}</pre>

        <p>I want it to update automatically</p>
        <p>Is this added automatically?</p>
        <p>Next trial</p>
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
</style>
