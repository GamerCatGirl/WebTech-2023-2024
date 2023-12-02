<script setup lang="ts">
import { theme, Theme } from "~/composables/theme";
useHead({ titleTemplate: "Good Food" });
</script>

<template>
    <div>
        <link v-if="theme === Theme.light" rel="stylesheet" href="/themes/soho-light/theme.css" />
        <link v-else rel="stylesheet" href="/themes/soho-dark/theme.css" />
        <Header />
        <NuxtPage />
        <Footer />
    </div>
</template>
