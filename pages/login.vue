<script setup lang="ts">
import { definePageMeta, useAuth, navigateTo } from '#imports'
const { data } = await useFetch("/api/test");
const { signIn, signOut, status, getProviders } = useAuth()
</script>

<template>
    <div>
        <title>Good Food</title>
        <pre>{{ data }}</pre>

        <form id="login">
            <h1>Login</h1>
            <label for="Username"> Username:</label>
            <input type="text" id="Username" name="fname" />

            <br />

            <label>Password:</label>
            <input type="password" />

            <br />
            <button @click="signIn('github', { callbackUrl: '/home'})"> login (github) </button>
            <button @click="signIn('google', { callbackUrl: '/home'})"> login (google) </button>
            <button @click="signIn('facebook', { callbackUrl: '/home'})"> login (facebook) </button>

            <button @click="signOut()">sign out</button>
            <br />

        </form>
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
</style>