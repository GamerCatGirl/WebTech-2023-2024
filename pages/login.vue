<script setup lang="ts">
import { definePageMeta, useAuth, navigateTo } from "#imports";
const { data } = await useFetch("/api/test");
const { signIn, signOut, status, getProviders } = useAuth();
</script>

<template>
  <div>
    <title>Good Food</title>
    <pre>{{ data }}</pre>

    <!--

    <form id="login">
      <h1>Login</h1>
      <label for="Username"> Username:</label>
      <input type="text" id="Username" name="fname" />

      <br />

      <label>Password:</label>
      <input type="password" />

      <br />
      <button @click="signIn('github', { callbackUrl: '/home' })">
        login (github)
      </button>
      <button @click="signIn('google', { callbackUrl: '/home' })">
        login (google)
      </button>
      <button @click="signIn('facebook', { callbackUrl: '/home' })">
        login (facebook)
      </button>

      <button @click="signOut()">sign out</button>
      <br />
    </form>
    -->
  </div>

    <div class="card">
      <div class="flex flex-column md:flex-row">
        <div
          class="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5"
        >
          <div
            class="flex flex-wrap justify-content-center align-items-center gap-2"
          >
            <label class="w-6rem">Username</label>
            <InputText id="username" type="text" class="w-12rem" />
          </div>
          <div
            class="flex flex-wrap justify-content-center align-items-center gap-2"
          >
            <label class="w-6rem">Password</label>
            <InputText id="password" type="password" class="w-12rem" />
          </div>

	  <!--Login -->
          <Button
            label="Login"
            icon="pi pi-user"
            class="w-10rem mx-auto"
          ></Button>
		
	  <!--Register-->
	  <Button
		  label="Register"
		  icon="pi pi-user-plus"
		  severity="succes"
		  class="w-10rem"
	  ></Button>
		  

        </div>
        <div class="w-full md:w-2">
          <Divider layout="vertical" class="hidden md:flex"><b>OR</b></Divider>
          <Divider layout="horizontal" class="flex md:hidden" align="center"
            ><b>OR</b></Divider
          >
        </div>
        <div
          class="w-full md:w-5 flex align-items-center justify-content-center py-5"
        >
	<p> Login/Register with </p>
          <Button
            label="Github"
            icon="pi pi-github"
            severity="success"
            class="w-10rem"

          ></Button>

	  <Button 
	    label="Google"
	    icon="pi pi-google"
	    severity="success"
	    class="w-10rem"
          ></Button>

	  <Button
		  label = "Facebook"
		  icon = "pi pi-facebook"
		  severity="success"
		  class="w-10rem"
	  ></Button>
        </div>
      </div>
    </div>

</template>

<style>
@import url("~/assets/css/style.css");
</style>
