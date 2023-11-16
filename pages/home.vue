<script setup lang="ts">
//import { SidebarMenu } from "#build/components";
//import Menu from "primevue/menu";
import 'primeicons/primeicons.css';

const { data, status } = useAuth();
const user = data.value?.user?.name;

const items = ref([
	{
	label: 'Title 1', 
	items: [
		{label: 'Home', icon: 'pi pi-home'}, 
		{label: 'Discover', icon: 'pi pi-globe'},
		{label: 'Search', icon: 'pi pi-search'}
		]
	}, 
	{
	label: 'Recipies', 
	items: [
		{label: 'New', icon: 'pi pi-plus'}, 
		{label: 'Edit', icon: 'pi pi-pencil'},
		{label: 'Saved', icon: 'pi pi-bookmark'}]
	}, 
	{
	label: 'Profile', 
	items: [
		{label: 'Notifications', icon: 'pi pi-inbox', badge: 3}, 
		{label: 'Comments', icon:'pi pi-comments', badge: 2}, 
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
		<div class="card flex justify-content-left">
			<Menu :model="items" />
		</div>

		<!-- <SidebarMenu/>  -->
	</div>
</template>

<!--
<style>
@import url("~/assets/css/style.css");
@import url("~/assets/css/menu.css");
</style>
-->
