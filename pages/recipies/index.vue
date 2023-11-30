<script setup lang="ts">
import { expect } from "vitest";

//import "primeflex/primeflex.css";

const selectedCities = ref();
const selectedTypesOfMeals = ref();
const selectedDifficulty = ref();


const cities = ref([
	{ name: "Belgium", code: "NY" },
	{ name: "Italy", code: "RM" },
	{ name: "France", code: "LDN" },
	{ name: "Germany", code: "IST" },
	{ name: "America", code: "PRS" },
]);


const typeOfMeals = ref([
	{ name: "Breakfast"},
	{ name: "Brunch" },
	{ name: "Lunch" },
	{ name: "Diner" },
	{ name: "Soup" },
	{ name: "Halal"},
	{ name: "Vegi"},
	{ name: "Vegan"},
]);

const difficulty = ref([
	{ name: "Easy" },
	{ name: "Medium" },
	{ name: "Hard" },
]);

const value = ref(60);
const rating = ref();

const allRecipes = await $fetch("/api/recipes");

function goToRecipe(r) {
	let name = r.name;
	let id = r.id;
	let nameSplited = name.split(" ");
	let nameForUrl = nameSplited[0];
	let url = "recipies/" + nameForUrl + "&" + id;
	navigateTo(url);
}

console.log("recipies (print recipy/index.vue): ");
</script>

<template>
	<!-- Filters -->
	<div class="card flex justify-content-left">
		<MultiSelect v-model="selectedCities" display="chip" :options="cities" optionLabel="name"
			placeholder="Select Countries" :maxSelectedLabels="3" class="w-full md:w-20rem" />

		<MultiSelect v-model="selectedTypesOfMeals" display="chip" :options="typeOfMeals" optionLabel="name"
			placeholder="Type of meals" :maxSelectedLabels="3" class="w-full md:w-20rem" />

		<MultiSelect v-model="selectedDifficulty" display="chip" :options="difficulty" optionLabel="name"
			placeholder="Difficulty" :maxSelectedLabels="3" class="w-full md:w-20rem" />


		<Button label="View on map" icon="pi pi-compass" />
	</div>

	<div class="card flex justify-content-center">
		<span>Min rating</span>
		<Rating v-model="rating" />
		<span>Max time: </span>
		<!--TODO: CSS voor tekst aanpassen-->
		<Knob v-model="value" />
	</div>
	<!--Recipie outline ---------- DOESNOT WORK NO IDEA WHY -->

	<div class="card flex justify-content-center gap-2">
		<Card v-for="recipy in allRecipes" @click="goToRecipe(recipy)">
			<template #title> {{ recipy.name }} </template>
			<template #content>
				<!--TODO new database with this data-->
				<div class="flex flex-wrap gap-2">
					<!--TODO: add the correct colors-->
					<Tag :value="recipy.type"></Tag>
					<Tag icon="" :value="recipy.difficulty" severity="success"></Tag>
					<Tag icon="pi pi-clock" :value="recipy.time" severity="success" rounded></Tag>
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
					<!--TODO: I don't know how to link the ref with the correct rating recipy.score-->
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
