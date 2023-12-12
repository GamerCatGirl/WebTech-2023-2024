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
        <Header />
        <NuxtPage />
        <Footer />
    </div>
</template>

<style>
html,
body {
    --body-margin: 8px;
    --footer-height: 78px;
    min-height: calc(100vh - var(--body-margin) * 2);
}

#__nuxt {
    min-height: calc(100vh - 2 * var(--body-margin));
}

#appComponent {
    min-height: calc(100vh - 2 * var(--body-margin) - var(--footer-height));
    position: relative;
    margin-bottom: var(--footer-height);
}

footer {
    position: absolute;
    width: 100%;
    bottom: calc(0px - var(--footer-height));
}
</style>
