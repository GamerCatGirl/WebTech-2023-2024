<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});
const { signIn } = useAuth();
const route = useRoute();
const callbackUrl = (route.query.callbackUrl?.valueOf() as string) ?? "/";

function emptyInput() {
    return {
        username: "",
        password: "",
      }
}
const input = ref(emptyInput())
</script>

<template>
  <div>
  <div>
    <title>Good Food</title>
  </div>

  <div class="card">
    <div class="flex flex-column md:flex-row">
      <div
        class="w-full flex flex-column align-items-center justify-content-center gap-3 py-5"
      >
        <div
          class="flex flex-wrap justify-content-center align-items-center gap-2"
        >
          <label class="w-6rem">Username</label>
          <InputText v-model="input.username" type="text" class="w-12rem" />
        </div>
        <div
          class="flex flex-wrap justify-content-center align-items-center gap-2"
        >
          <label class="w-6rem">Password</label>
          <InputText v-model="input.password" type="password" class="w-12rem" />
        </div>

        <!--Login -->
        <Button
          label="Login"
          icon="pi pi-user"
          class="w-10rem mx-auto"
          @click="signIn('credentials', {username:input.username, password:input.password})"
        ></Button>

        <!--Register-->
        <Button
          label="Register"
          icon="pi pi-user-plus"
          severity="succes"
          class="w-10rem"
          @click="() => navigateTo('/register')"
        />
        <Divider layout="horizontal" class="hidden md:flex"><b>OR</b></Divider>
          <Button
            label="Github"
            icon="pi pi-github"
            severity="success"
            class="w-10rem"
            @click="signIn('github', { callbackUrl })"
          />
      </div>
    </div>
  </div>
  </div>
</template>
