<script setup lang="ts">
import { SidebarMenu } from '#build/components';

const {data, status} = useAuth();
const user = data.value?.user?.name;
</script>

<template>
    <div>
        <title>Good Food</title>
        <div id="menu">
            <h1> Menu </h1> 
            <!-- <SidebarMenu/> -->
            <ul>
                <li>Home</li>
                <li>Map</li>
                <li>My Recipies</li>
                <li>Profile </li>
            </ul>
         </div>
        **** {{ user }} ****
        Home, a place where you belong! 
        <!-- <SidebarMenu/>  -->
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
</style>
