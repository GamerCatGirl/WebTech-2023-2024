<script setup lang="ts">
/* TODO:
- make password confirmation check
- take chosen country's key 
- register user in db
- inline errors: only appear when wrong data posted
- inline errors: hide and use good layout
- make frontend mobile friendly!
*/
definePageMeta({
    middleware: "auth",
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});
//TODO: make generic for both 
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

//post request
async function register() {
    if (input.value.password == passwordConfirmation.value) {
        const body = await $fetch("/api/users/registration", {
            method: "post",
            body: input.value,
        });
        console.log("finsihed!");
    }
    //TODO: when request fails: let user try again
}

const countries: Ref<Array<any>> = ref([]);

//TODO: make dictionary that stores country keys
//countries are sorted by countryCode and not name
async function fetchCountryJSON() {
    const target = 'https://flagcdn.com/en/codes.json';
    const response = await fetch(target);
    const countryData = await response.json();
    for (const [key, value] of Object.entries(countryData)) {
        countries.value.push(value);
    }
}

//gets executed when page is fully mounted
fetchCountryJSON();
</script>

<template>
    <div class="editOverview flex flex-column md:flex-row" style="margin:auto;">
        <div class="editFields flex flex-column align-items-center justify-content-center gap-3 py-5" style="margin:auto;">
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="true" class="errorMessage"></div>
                <label for="new-name" class="w-6rem">Name</label>
                <InputText v-if="true" v-model="input.name" type="text" required class="p-invalid" />
                <InputText v-else v-model="input.name" type="text" required />
                <InlineMessage class="errorMessage">Name is Required!</InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="false" class="errorMessage"></div>
                <label class="w-6rem">Username</label>
                <InputText type="text" required />
                <InlineMessage v-if="false" class="errorMessage">Username is Required!</InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">E-mail address</label>
                <!--TODO: email form validation-->
                <InputText v-model="input.email" type="email" required />
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Password</label>
                <Password v-model="input.password" type="text" toggleMask required>
                </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Confirm password</label>
                <Password v-model="passwordConfirmation" type="text" :feedback="false" toggleMask required>
                </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Choose your country</label>
                <Dropdown v-model="input.country" :options="countries" placeholder="Select a Country">
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