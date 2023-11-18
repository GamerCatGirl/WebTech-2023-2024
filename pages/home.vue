<script setup lang="ts">
//import { SidebarMenu } from "#build/components";
//import Menu from "primevue/menu";
import 'primeicons/primeicons.css';

const { data, status } = useAuth();
const user = data.value?.user?.name;

const items = ref([
	{
	label: 'Profile', 
	items: [
		{label: 'Settings', icon:'pi pi-cog'}, 
		{label: 'Logout', icon: 'pi pi-sign-out'}
	]
	}
]);
</script>

<template>
	<div>
		<title>Good Food</title>
		<!-- From PRIME VUE DOCUMENTATION -->

		<!-- <SidebarMenu/>  -->
	</div>
</template>

<!--
<style>
@import url("~/assets/css/style.css");
@import url("~/assets/css/menu.css");
</style>
-->
