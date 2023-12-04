<template>
</template>


<script setup>
definePageMeta({ middleware: 'auth', navigateUnauthenticatedTo: '/login?callbackUrl=/recipes/saved' })
</script>
