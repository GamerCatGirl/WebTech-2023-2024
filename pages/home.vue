<script setup lang="ts">
import { SidebarMenu } from '#build/components';

const {data, status} = useAuth();
const user = data.value?.user?.name;
</script>

<template>
    <div>
        <title>Good Food</title>
        **** {{ user }} ****
        Home, a place where you belong! 
        <!-- <SidebarMenu/>  -->
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
@import url("~/assets/css/menu.css");
</style>
