<script setup lang="ts">
import { countries, fetchChosenCountryKey, fetchCountryFlag, fetchCountryValue } from "~/composables/countryAPI";
import { insertUserSchema } from '~/database/auth';
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/valibot";

/*TODO:
- change username in database
- change country in database
- fix layout (css )
*/

definePageMeta({
    middleware: "auth",
});
const { data } = useAuth();
const userIcon: string = data.value?.user?.image ?? "";
const userID = data.value?.user?.id;

const countryName = ref("");
const input = ref({ userName: await fetchUserName(), countryKey: await fetchCountryKey() });
function setCountryFlag() {
    return fetchCountryFlag(input.value.countryKey);
}

function checkIfCountrySelected(): Boolean {
    return input.value.countryKey != null;
};

function checkForUserIcon(): Boolean {
    return userID != null;
}

async function fetchCountryKey() {
    const body = await useFetch(`/api/users/${userID}`);
    return body.data.value.country;
}

async function fetchUserName() {
    const body = await useFetch(`/api/users/${userID}`);
    return body.data.value.name;
}

async function saveChanges() {
    const sendUser = {
        name: input.value.userName,
        country: input.value.countryKey,
    };
    const body = await $fetch(`/api/users/${userID}/edit`, {
        method: "post",
        body: sendUser,
    });
}
//fetchUserData();
</script>

<template>
    <div class="editOverview flex flex-column align-items-center w-full">
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
                <Avatar v-if="checkIfCountrySelected()" shape="circle" size="large" :image="setCountryFlag()">
                </Avatar>
            </div>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-space-between">
            Change username
            <InputText v-model="input.userName" id="new-username" placeholder="new username" class="inputBox">
            </InputText>
        </div>
        <div class=" editElement flex flex-row align-items-center justify-content-space-between">
            Change country
            <Dropdown style="width:250px" placeholder="Select a Country" v-model="input.countryName"
                @update:model-value="(newVal: string) => { input.countryKey = fetchChosenCountryKey(newVal[1]); countryName = newVal[1]; }"
                :options="Object.entries(countries)" :optionLabel="(item) => item[1]">
            </Dropdown>
        </div>
        <div class="editElement flex flex-row align-items-center justify-content-center">
            <Button @click="saveChanges()">
                Save changes
            </Button>
        </div>
    </div>
</template>

<style>
@import '~/assets/css/profile/edit.css'
</style>
