<script setup lang="ts">
/*definePageMeta({
    name:"testlalal1", //verandert enkel wat na "/profile" komt, wordt overschreven als onderste twee defined zijn
    //alias:"/elyiscool", //verandert heel de path of na '/profile'
    title: 'Blablabla'
})*/
useHead({
    //titleTemplate: '%s blabla', //can put a function here instead of string
    titleTemplate: (x)=>('test'),
})
</script>

<template>
    <div>
    User profile
    </div>
</template>

<style>

</style>