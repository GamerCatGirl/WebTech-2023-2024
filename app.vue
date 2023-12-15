<script setup lang="ts">
import { initializeTheme, getTheme, Theme } from "~/composables/theme";
useHead({ titleTemplate: "Good Food" });
initializeTheme();
const theme = getTheme();
</script>

<template>
    <div id="appComponent">
        <link v-if="theme === Theme.light" rel="stylesheet" href="/themes/soho-light/theme.css" />
        <link v-else rel="stylesheet" href="/themes/soho-dark/theme.css" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Newsreader" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />
        <Header />
        <NuxtPage />
        <Footer />
    </div>
</template>

<style>
html,
body {
    --body-margin: 8px;
    min-height: calc(100vh - var(--body-margin) * 2);
}

#__nuxt {
    min-height: calc(100vh - var(--body-margin) * 2);
}

#appComponent {
    min-height: calc(100vh - var(--body-margin) * 2);
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 100%;
}

footer {
    width: 100%;
}
</style>
