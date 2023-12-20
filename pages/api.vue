<script setup lang="ts">
import { apiRoutes } from "~/composables/api";

const url = useRequestURL();
const baseURL = url.origin;
</script>

<template>
    <div class="apiDocs">
        <h1>API documentation</h1>
        This is the API documentation for our site.
        <br />
        Some routes do require authentication, if you are using them through this page, and you are logged in this will not
        be a problem, otherwise you should use an API key. You can get your API key in your profile and then add it as a
        query parameter to your link to use it.
        <br />
        For example if you wanted to send a POST request to <code>/api/recipes</code>, you would have to use the URL
        <code>/api/recipes?apiKey=[MySecretAPIKey]</code>.
        <apiRoute :api-routes="apiRoutes" :base-u-r-l="baseURL" />
    </div>
</template>
