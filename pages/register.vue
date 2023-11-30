<script setup lang="ts">

</script>

<template>
    <div class="card">
        <div class="flex flex-column md:flex-row">
            <div class="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5" style="margin:auto;">
                <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label class="w-6rem">Name</label>
                    <InputText id="new-name" type="text" class="w-12rem" required />
                </div>
                <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label class="w-6rem">E-mail address</label>
                    <InputText id="new-email" type="email" class="w-12rem" required />
                </div>
                <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label class="w-6rem">Username</label>
                    <InputText id="new-username" type="text" class="w-12rem" required />
                </div>
                <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label class="w-6rem">Password</label>
                    <InputText id="new-password" type="password" class="w-12rem" minlength="6" required />
                </div>
                <div class="flex flex-wrap justify-content-center align-items-center gap-2">
                    <label class="w-6rem">Confirm password</label>
                    <InputText id="new-confirm-password" type="password" class="w-12rem" required/>
                </div>

                <Button 
                label="Register" 
                icon="pi pi-send" 
                class="w-10rem mx-auto"
                type="submit">
                </Button>
            </div>
        </div>
    </div>
</template>