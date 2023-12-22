<script setup lang="ts">
import { countries, fetchChosenCountryKey, fetchCountryFlag } from "~/composables/countryAPI";
import { useToast } from "primevue/usetoast";
import { } from "~/composables/userValidation";

definePageMeta({
    middleware: "auth",
});
const { data } = useAuth();
let changesSubmitted: boolean = true;
const userIcon: string = data.value?.user?.image ?? "";
const userID = data.value?.user?.id;
const userData = ref({ name: await fetchUserName(), country: await fetchCountryKey() })
const toast = useToast();
let validName: Boolean = true;

const countryName = ref("");
const input = ref({ userName: userData.value.name, countryKey: userData.value.country });
function setCountryFlag() {
    return fetchCountryFlag(userData.value.country);
}

function checkIfCountrySelected(): Boolean {
    return userData.value.country != null;
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
    if (validName) {
        const sendUser = {
            name: input.value.userName,
            country: input.value.countryKey,
        };
        const body = await $fetch(`/api/users/${userID}/edit`, {
            method: "post",
            body: sendUser,
        });
        if (body) {
            userData.value.name = body.name;
            userData.value.country = body.country;
            toast.add({
                severity: "success",
                detail: "Changes have been succesfully submitted!",
                life: 3000,
            })
            changesSubmitted = true;
        }
    } else {
        toast.add({
            severity: "error",
            detail: "Please submit a valid new username.",
            life: 3000,
        })
    }
}

function onUsernameChange(newName: string) {
    validName = checkValidUsername(newName);
    if (validName) {
        input.value.userName = newName;
        changesSubmitted = false;
    }
}

onBeforeRouteLeave((to, from) => {
    if (!changesSubmitted) {
        const res = confirm("Do you really want to leave? You have unsaved changes.")
        if (!res) return false;
    }
});
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
            <InputText v-model="input.userName" id="new-username" placeholder="new username" class="inputBox"
                :class="{ 'p-invalid': !validName }" @update:model-value="(newName: string) => onUsernameChange(newName)">
            </InputText>
        </div>
        <div class=" editElement flex flex-row align-items-center justify-content-space-between">
            Change country
            <Dropdown style="width:250px" placeholder="Select a Country" v-model="countryName"
                @update:model-value="(newVal: string) => { input.countryKey = fetchChosenCountryKey(newVal[1]); countryName.value = newVal[1]; changesSubmitted = false;}"
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
