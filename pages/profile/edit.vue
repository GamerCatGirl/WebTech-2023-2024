<script setup lang="ts">
const username = "[username]";
const countryTypes = "";
const countries = ref(["Turkey", "Germany", "Belgium"]);
</script>

<template>
    <div class="editOverview flex flex-column align-items-center">
        <div>
            <h1>Editing User Settings </h1>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <Avatar icon="pi pi-user" size="xlarge">
            </Avatar>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-space-between">
            Change username
            <InputText v-model="username" id="new-username" placeholder=username class="inputBox">
            </InputText>
        </div>
        <div class=" editElement flex flex-row align-items-center justify-content-space-between">
            Change country
            <Dropdown v-model="countryTypes" :options="countries" editable placeholder="Select a Country">
            </Dropdown>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <Button
            @click="">
                Save changes
            </Button>
        </div>
    </div>
</template>

<style>
@import "./assets/css/profile/edit.css"
</style>