<script setup lang="ts">


var input = ref(newDummy())

function newDummy() {
    return {
        Name: "",
        Email: "",
        EmailVerified: "",
        image: " "
    };
}
//post request
async function register() {
    let currentValue = {
        id: 6,
        name: input.value.Name,
        email: input.value.Email,
        emailVerified: "test",
        image: input.value.image
    }

    const body = await $fetch("/api/users/registration", {
        method: "post",
        body: currentValue,
    });
    console.log(currentValue)
}
</script>

<template>
    <div class="editOverview flex flex-column md:flex-row" style="margin:auto;">
        <div class="editFields flex flex-column align-items-center justify-content-center gap-3 py-5" style="margin:auto;">
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <div class="errorMessage"></div>
                <label for="new-name" class="w-6rem">Name</label>
                <InputText v-if="true" id="new-name" v-model="input.Name" type="text" required class="p-invalid" />
                <InputText v-if="false" id="new-name" v-model="input.Name" type="text" required/>
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
                <InputText id="new-email" v-model="input.Email" type="email" required />
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Password</label>
                <Password> </Password>
            </div>
            <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                <label class="w-6rem">Confirm password</label>
                <InputText id="new-confirm-password" type="password" class="w-12rem" required />
            </div>
            <div class="">
                <!-- make a select country button -->
                <Button label="Register" icon="pi pi-send" class="w-10rem mx-auto" type="submit" @click="register()">
                </Button>
            </div>
        </div>
    </div>
</template>

<style>
@import "./assets/css/profile/edit.css"
</style>