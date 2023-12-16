<script setup lang="ts">
import { Theme } from "~/composables/theme";
defineProps<{
    error: any;
}>();

const theme = useCookie("theme", { default: () => Theme.light });
const handleError = () => clearError({ redirect: "/" });
</script>

<template>
    <div>
        <div class="error errorPageDiv" :class="theme === Theme.light ? 'light' : 'dark'">
            <h1>{{ error.statusCode }}</h1>
            <h2>{{ error.message }}</h2>
            <button @click="handleError">Go back home</button>
        </div>
    </div>
</template>

<style>
body:has(.errorPageDiv) {
    padding: 0;
    margin: 0;
}
</style>

<style scoped>
* {
    padding: 0;
    margin: 0;
}

h1 {
    font-size: 5rem;
}

h2 {
    font-size: 2rem;
}

.error {
    width: 100%;
    min-height: 80vh;
    padding-top: 20vh;
    text-align: center;
}

.error > * {
    margin-top: 10px;
}

button {
    background-color: white;
    font-size: 2rem;
    border: 2px solid grey;
    border-radius: 10px;
    padding: 10px 20px;
    transition-duration: 200ms;
    margin-top: 2rem !important;
}

button:hover {
    background-color: lightgray;
}

html:has(.dark) {
    background-color: black;
}

.dark {
    color: white;
    background-color: black;
}

.dark button {
    background-color: black;
    color: white;
}

.dark button:hover {
    background-color: darkgray;
}
</style>
