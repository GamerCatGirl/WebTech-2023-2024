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
const { signIn } = useAuth();
var input = ref(
    {
        name: "",
        id: "",
        email: "",
        password: "",
        image: "",
        country: ""

    })

//post request
async function register() {
    let currentValue = {
        name: input.value.name,
        id: "3",
        email: input.value.email,
        password: input.value.password,
        image: input.value.image,
        country: input.value.country
    }

    const body = await $fetch("/api/users/registration", {
        method: "post",
        body: currentValue,
    });
    console.log(currentValue)

}

const countries: Ref<Array<any>> = ref([]);

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
                <InputText v-if="true" id="new-name" v-model="input.name" type="text" required class="p-invalid" />
                <InputText v-else id="new-name" v-model="input.name" type="text" required />
                <InlineMessage class="errorMessage">Name is Required!</InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div v-if="false" class="errorMessage"></div>
                <label class="w-6rem">Username</label>
                <InputText id="new-username" type="text" required />
                <InlineMessage v-if="false" class="errorMessage">Username is Required!</InlineMessage>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">E-mail address</label>
                <InputText id="new-email" v-model="input.email" type="email" required />
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Password</label>
                <Password v-model="input.password"> </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Confirm password</label>
                <InputText id="new-confirm-password" type="password" class="w-12rem" required />
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