<script setup lang="ts">
import { ConsoleLogWriter } from 'drizzle-orm';
import { check } from 'drizzle-orm/sqlite-core';

/*TODO:
- fix error with countryFlag
- chose a country from the list
- submit changes
- change username in database
- change country in database
- fix layout (css )
*/

definePageMeta({
    // middleware:"auth",//redirects to /login when loggedIn is false
});
const { data } = useAuth();
const user = data.value?.user?.id;
const loggedInUserName = data.value?.user?.name;
console.log(loggedInUserName);

//TODO: fetch currentSelectedCountry from database
let currentSelectedCountry = "Belgium"
const countryTypes = "";
const countries = ref([]);
const countryFlag: globalThis.Ref<any> = ref([""]);

//TODO: sort the countries in alphabetical order
const fetchCountryData = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all')
    const jsonData = await response.json();
    countries.value = jsonData.map((country: any) => country.name.common);
    if (checkIfCountrySelected()) {
        const response2 = await fetch('https://restcountries.com/v3.1/name/' + currentSelectedCountry + '?fields=flags');
        const jsonData2 = await response2.json();
        countryFlag.value = jsonData2[0].flags.png;
    }
};

function checkIfCountrySelected(): Boolean {
    return currentSelectedCountry.length != 0
};

onMounted(fetchCountryData);

</script>

<template>
    <div class="editOverview flex flex-column align-items-center">
        <div>
            <h1>Editing User Settings </h1>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <div class="flex flex-column">
                <!--TODO: if the user has a picture, display that, else, display the user-icon -->
                <Avatar icon="pi pi-user" size="xlarge">
                </Avatar>
            </div>
            <div class="flex flex-column" style="margin-left: 20px;">
                <Avatar v-if="checkIfCountrySelected()" shape="circle" size="large" :image="countryFlag">
                </Avatar>
            </div>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-space-between">
            Change username
            <InputText v-model="loggedInUserName" id="new-username" placeholder=username class="inputBox">
            </InputText>
        </div>
        <div class=" editElement flex flex-row align-items-center justify-content-space-between">
            Change country
            <Dropdown :options="countries" editable placeholder="Select a Country">
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