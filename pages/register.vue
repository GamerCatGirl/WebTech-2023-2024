<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { countries } from "~/composables/countryAPI";

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
const toast = useToast();
/** Check if inputs are valid according to the specified regex. 
 * Intially all values are false, because the user starts off empty.
 * @returns true if input is valid
 * @returns false if input is invalid
*/
const inputValidation = ref({ name: false, email: false, password: false, country: false })
let firstChangeHappened: boolean = false;
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
const countryName = ref("");
var input = ref(emptyInput())

function registerFirstChange() {
    firstChangeHappened = true;
}
function onUsernameChange(newName: string) {
    registerFirstChange()
    inputValidation.value.name = checkValidUsername(newName);
}
function onEmailChange(newEmail: string) {
    registerFirstChange();
    inputValidation.value.email = checkValidEmail(newEmail);
}
function onPasswordChange(newPassword: string) {
    registerFirstChange();
    inputValidation.value.password = checkValidPassword(newPassword);
}
function onCountryChange() {
    registerFirstChange();
    inputValidation.value.country = true;
}

async function register() {
    if (input.value.password == passwordConfirmation.value) {
        if (input.value.name && input.value.country && input.value.email && input.value.password && firstChangeHappened) {
            await $fetch("/api/users/registration", {
                method: "post",
                body: input.value,
            });
            navigateTo("/login");
            toast.add({
                severity: "success",
                detail: "You have successfully registered. You can now log in.",
                life: 4000
            })
        } else {
            toast.add({
                severity: "error",
                detail: "You entered wrong information. Please, try again.",
                life: 4000
            })
        }
    } else {
        toast.add({
            severity: "error",
            detail: "Passwords do not match. Please try again.",
            life: 3000
        })
    }
}
</script>

<template>
    <div class="editOverview flex flex-column md:flex-row w-full" style="margin:auto;">
        <div class="editFields flex flex-column align-items-center justify-content-center gap-3 py-5" style="margin:auto;">
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="!inputValidation.name && firstChangeHappened" class="errorMessage"></div>
                <label class="w-6rem">Username</label>
                <InputText type="text" class="inputBoxRegister"
                    :class='{ "p-invalid": !inputValidation.name && firstChangeHappened }' required v-model="input.name"
                    @update:model-value="(newName: string) => onUsernameChange(newName)" />
                <InlineMessage v-if="!inputValidation.name && firstChangeHappened" class="errorMessage">Valid username is
                    required!
                </InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="!inputValidation.email && firstChangeHappened" class="errorMessage"></div>
                <label class="w-6rem">E-mail address</label>
                <InputText v-model="input.email" type="email" class="inputBoxRegister"
                    :class='{ "p-invalid": !inputValidation.email && firstChangeHappened }' required
                    @update:model-value="(newEmail: string) => onEmailChange(newEmail)" />
                <InlineMessage v-if="!inputValidation.email && firstChangeHappened" class="errorMessage">Valid e-mail is required!
                </InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Password</label>
                <Password v-model="input.password" type="text" class="inputBoxRegister"
                    :class='{ "p-invalid": !inputValidation.password && firstChangeHappened }' toggleMask required
                    @update:model-value="(newPassword: string) => onPasswordChange(newPassword)">
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
                <Dropdown v-model="countryName"
                    @update:model-value="(newVal: string) => { onCountryChange(), input.country = newVal[0]; countryName.value = newVal[1]; }"
                    :options="Object.entries(countries)" :optionLabel="(item) => item[1]" class="inputBoxRegister"
                    :class="{ 'p-invalid': !inputValidation.country && firstChangeHappened }" placeholder="Select a Country">
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
@import '~/assets/css/profile/edit.css'</style>
