<script setup lang="ts">
import { ConsoleLogWriter } from 'drizzle-orm';

/*TODO:
- submit changes
- change username in database
- change country in database
- fix layout (css )
*/

definePageMeta({
    //middleware:"auth",//redirects to /login when loggedIn is false
});
const username = "[username]";
const countryTypes = "";
const countries = ref([]);
//TODO: take the picture from the database
const countryFlag = "https://flagcdn.com/w320/cx.png";//placeholder for now

//TODO: sort the countries in alphabetical order
const fetchCountryData = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all')
    const jsonData = await response.json();
    countries.value = jsonData.map((country:any) => country.name.common);
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
                <Avatar shape="circle" size="large" :image="countryFlag">
                </Avatar>
            </div>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-space-between">
            Change username
            <InputText v-model="username" id="new-username" placeholder=username class="inputBox">
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