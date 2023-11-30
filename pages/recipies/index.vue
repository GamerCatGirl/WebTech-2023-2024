<script setup lang="ts">
import { expect } from "vitest";

//import "primeflex/primeflex.css";

const selectedCities = ref();
const cities = ref([
	{ name: "New York", code: "NY" },
	{ name: "Rome", code: "RM" },
	{ name: "London", code: "LDN" },
	{ name: "Istanbul", code: "IST" },
	{ name: "Paris", code: "PRS" },
]);
const value = ref(3);

const recipes = await $fetch("/api/recipes");

function goToRecipe(recipy){
	console.log("clicked on recipy with name " + recipy.name);
	let name = recipy.name;
	let id = recipy.id;
	let nameSplited = name.split(" ");
	let nameForUrl = nameSplited[0];
	let url = "recipies/" + nameForUrl + "&" + id;
	navigateTo(url);
	console.log(url);


}

recipes.map((recipe) => {
	console.log(recipe);
});

console.log("recipies (print recipy/index.vue): ");
console.log(recipes);
</script>

<template>
	<!-- Filters -->
	<div class="card flex justify-content-left">
		<span class="p-float-label">
			<MultiSelect id="ms-cities" v-model="selectedCities" :options="cities" optionLabel="name"
				:maxSelectedLabels="3" class="w-full md:w-20rem" />
			<label for="ms-cities">MultiSelect</label>
		</span>
	</div>
	<!--Recipie outline ---------- DOESNOT WORK NO IDEA WHY -->

	<div class="card flex justify-content-center gap-2">
		<Card  v-for="recipy in recipes" @click="goToRecipe(recipy)">
		<template #title> {{recipy.name}} </template>
			<template #content>
				<!--TODO new database with this data-->
				<div class="flex flex-wrap gap-2">
					<Tag value="Dessert"></Tag>
					<Tag icon="" value="Easy" severity="success"></Tag>
					<Tag icon="pi pi-clock" value="'15" severity="success" rounded></Tag>
				</div>

				<!--Insert a picture-->
				<div class="card flex">
					<Image src="Tiramisu.png" alt="Image" width="200" />
				</div>

				<p class="m-0">Made by @Silken</p>
				<!-- Display kind of recipy: dessert, lunch, ...--->
				<!--Display figures like meat, vegi, halal, vegan, ...-->
				<!-- Display the time and dificulty-->
				<!--Display de rating -->
				<div class="card flex">
					<Rating v-model="value" readonly :cancel="false" class="flex gap-2" />
				</div>
			</template>
		</Card>
	</div>


	<div class="card">
		<Paginator :template="{
			'640px': 'PrevPageLink CurrentPageReport NextPageLink',
			'960px':
				'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
			'1300px':
				'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
			default:
				'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput',
		}" :rows="10" :totalRecords="120">
		</Paginator>
	</div>
	<!-- 
  <div class="card">
    <Fieldset legend="Example 1">
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatanon proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </p>
    </Fieldset>
  </div>
  -->
</template>
