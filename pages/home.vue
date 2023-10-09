<script setup lang="ts">
const { data } = await useFetch("/api/test");
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
        </form>

        <p>I want it to update automatically</p>
        <p>Is this added automatically?</p>
        <p>Next trial</p>
    </div>
</template>

<style>
@import url("~/assets/css/style.css");
</style>
