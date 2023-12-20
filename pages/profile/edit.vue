<script setup lang="ts">
import { ConsoleLogWriter } from 'drizzle-orm';
import { check } from 'drizzle-orm/sqlite-core';
import { any } from 'valibot';

/*TODO:
- neem country dropdown menu van components!
- fix error with countryFlag
- chose a country from the list
- submit changes
- change username in database
- change country in database
- fix layout (css )
*/

definePageMeta({
    middleware: "auth",//redirects to /login when loggedIn is false
});
const { data } = useAuth();
const user = data.value?.user?.id;
const loggedInUserName = data.value?.user?.name;
const userIcon: string = data.value?.user?.image ?? "";

//TODO: fetch currentSelectedCountry from database
const currentSelectedCountry = "be";//data.value?.user?.country ?? ""; //only save country key in db
const countries: Ref<Array<any>> = ref([]);
const countryFlag: Ref<string> = ref("");

//countries are sorted by countryCode and not name
async function fetchCountryJSON() {
    const target = 'https://flagcdn.com/en/codes.json';
    const response = await fetch(target);
    const countryData = await response.json();
    for (const [key, value] of Object.entries(countryData)) {
        countries.value.push(value);
    }
}

async function fetchCountryFlag() {
    if (checkIfCountrySelected()) {
        const flagSize = "w80";
        countryFlag.value = 'https://flagcdn.com/' + flagSize + '/' + currentSelectedCountry + '.png';
    }
}

function checkIfCountrySelected(): Boolean {
    return currentSelectedCountry.length != 0;
};

function checkForUserIcon(): Boolean {
    return user != "";
}

fetchCountryJSON();
fetchCountryFlag();

</script>

<template>
    <div class="editOverview flex flex-column align-items-center">
        <div>
            <h1>Editing User Settings </h1>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <div class="flex flex-column">
                <Avatar v-if="checkForUserIcon()" :image="userIcon" size="xlarge">
                </Avatar>
                <Avatar v-else icon="pi pi-user" size="xlarge">
                </Avatar>
            </div>
            <div class="flex flex-column" style="margin-left: 20px;">
                <Avatar v-if="checkIfCountrySelected()" shape="circle" size="large" :image="countryFlag">
                </Avatar>
            </div>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-space-between">
            Change username
            <InputText v-model="loggedInUserName" id="new-username" placeholder="new username" class="inputBox">
            </InputText>
        </div>
        <div class=" editElement flex flex-row align-items-center justify-content-space-between">
            Change country
            <Dropdown style="width:250px" :options="countries" placeholder="Select a Country">
            </Dropdown>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <Button @click="">
                Save changes
            </Button>
        </div>
    </div>
</template>

<style>
@import '~/assets/css/profile/edit.css'
</style>