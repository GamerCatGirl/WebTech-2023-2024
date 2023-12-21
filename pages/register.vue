<script setup lang="ts">
import { countries, fetchChosenCountryKey } from "~/composables/countryAPI";
/* TODO:
- make password confirmation check
- inline errors: only appear when wrong data posted
- inline errors: hide and use good layout
- make frontend mobile friendly!
*/
definePageMeta({
    middleware: "auth",
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const passwordConfirmation: Ref<string> = ref("");
function emptyInput() {
    return {
        name: "",
        email: "",
        password: "",
        image: "",
        country: ""

    }
}
var input = ref(emptyInput())
const country = ref({});

//post request
async function register() {
    if (input.value.password == passwordConfirmation.value) {
        const body = await $fetch("/api/users/registration", {
            method: "post",
            body: input.value,
        });
        input.value = emptyInput()
    }
    //TODO: when request fails: let user try again
}
</script>

<template>
    <div class="editOverview flex flex-column md:flex-row" style="margin:auto;">
        <div class="editFields flex flex-column align-items-center justify-content-center gap-3 py-5" style="margin:auto;">
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="false" class="errorMessage"></div>
                <label for="new-name" class="w-6rem">Name</label>
                <InputText v-if="false" v-model="input.name" type="text" required class="p-invalid" />
                <InputText v-else v-model="input.name" class="inputBoxRegister" type="text" required />
                <!--<InlineMessage class="errorMessage">Name is Required!</InlineMessage>-->
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="false" class="errorMessage"></div>
                <label class="w-6rem">Username</label>
                <InputText type="text" class="inputBoxRegister" required />
                <InlineMessage v-if="false" class="errorMessage">Username is Required!</InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">E-mail address</label>
                <!--TODO: email form validation-->
                <InputText v-model="input.email" type="email" class="inputBoxRegister" required />
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Password</label>
                <Password v-model="input.password" type="text" class="inputBoxRegister" toggleMask required>
                </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Confirm password</label>
                <Password v-model="passwordConfirmation" type="text" class="inputBoxRegister" :feedback="false" toggleMask
                    required>
                </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Choose your country</label>
                <Dropdown v-model="country"
                    @update:model-value="(newVal: string) => { input.country = fetchChosenCountryKey(newVal[1]); country.value = newVal[1]; }"
                    :options="Object.entries(countries)" :optionLabel="(item) => item[1]" class="inputBoxRegister"
                    placeholder="Select a Country">
                </Dropdown>
            </div>
            <div>
                <!-- make a select country button -->
                <Button label="Register" icon="pi pi-send" class="w-10rem mx-auto" type="submit" @click="register()">
                </Button>
            </div>
        </div>
    </div>
</template>

<style>
@import '~/assets/css/profile/edit.css'
</style>