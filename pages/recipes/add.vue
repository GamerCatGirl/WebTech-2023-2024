<template>
	<div class="card">
		<Toolbar>
			<template #start>
				<Button label="Delete" icon="pi pi-times" severity="danger" class="mr-2" />

				<!-- 	
				<Button icon="pi pi-plus" class="mr-2" />
				<Button icon="pi pi-pencil" class="mr-2" />
				<Button icon="pi pi-print" class="mr-2" />
				-->
			</template>

			<template #end>
				<Button label="Save" icon="pi pi-check" class="mr-2" @click="save()" />
				<Button label="Publish" icon="pi pi-upload" class="mr-2" severity="success" />
			</template>
		</Toolbar>
	</div>

	<div class="card flex justify-content-center gap-3">
		<InputText placeholder="Recipy Name" v-model="recipyName" size="large" :disabled="false" />
		<!-- Put it in disabled mode when recipy already exists -->

		<InlineMessage severity="error">Recipy name is required</InlineMessage>
	</div>
	<div class="card flex justify-content-center gap-3">
		<Chip :label="uploaded" />

		<FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
			@upload="onUpload" :auto="true" chooseLabel="Browse" />
	</div>

	<div class="card flex justify-content-center gap-3">
		<Image :src="image" height="250" preview />
	</div>

	<InputText placeholder="Thumbnail" v-model="thumbnail" />

	<div class="card flex flex-column md:flex-row gap-3" v-for="input in inputs">
		<Chip :label="input.Label" v-model="input.new" />
		<!-- TODO adding row numbers for error handling-->
		<!-- Name Ingredient -->
		<InputText placeholder="Ingredient Name" aria-labelledby="ingredient name" v-model="input.Ingredient" />

		<!-- Amount -->
		<InputNumber v-model="input.Amount" placeholder="Amount" />

		<!-- Select the type of amount -->
		<div class="card flex justify-content-center">
			<Dropdown editable :options="amountTypes" optionLabel="name" placeholder="Type" v-model="input.Type"
				class="w-full md:w-14rem" />
		</div>

		<!-- Select a category -->
		<div class="card flex justify-content-center">
			<Dropdown editable :options="categoriesIngredients" optionLabel="name" v-model="input.Category"
				placeholder="Category" class="w-full md:w-14rem" />
		</div>

		<Button icon="pi pi-times" :v-model="input.Counter" @click="deleteIngredient(input.Counter)" severity="danger">
		</Button>
		<Toast />
		<Button icon="pi pi-plus" @click="addNewRow()"> </Button>
	</div>

	<div class="card">
		<Editor v-model="value" editorStyle="height: 320px" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const recipyName = ref("");
const image = ref();

const toast = useToast();
const value = ref("");
const uploaded = ref("new");
const currentUser = "admin";

const categoriesIngredients = ref([
	{ name: "Vegtable" },
	{ name: "Meat" },
	{ name: "Fish" },
]);

const category = ref();
const amount = ref();

const amountTypes = ref([
	{ name: "Pieces" },
	{ name: "grams" },
	{ name: "ml" },
]);

const amountType = ref();
const picture = ref({ url: "test.png" });
const dummyObject = {
	Ingredient: "",
	Counter: "",
	Category: "",
	Amount: "amount",
	Type: "type",
};

let counter = 0;
let amountDeleted = 0;
const inputs = ref([newDummy()]);

function newDummy() {
	return {
		Label: "New",
		Ingredient: "",
		Counter: counter,
		Category: "",
		Amount: null,
		Type: "",
	};

	//const newDummy.value.Ingredient = ref(),

	//return newDummy;
}

function addNewRow() {
	counter += 1;
	inputs.value.push(newDummy());
}

const onUpload = (event) => {
	picture.value.url = event.files[0].objectURL;
	image.value = picture.value.url;
};

function deleteIngredient(idString) {
	//checken dat ref niet leeg wordt, anders error throwen met toast
	const id = Number(idString);

	//add a confirmationDialog

	if (counter == amountDeleted) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Add a new row before removing this one",
			life: 3000,
		});
	} else {
		inputs.value.splice(id - amountDeleted, 1);
		amountDeleted += 1;
	}
}

async function save() {
	//to implement

	if (recipyName.value == "") {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Fill in the Recipy Name",
			life: 3000,
		});
	} else {

		if (image.value != null) {
			uploaded.value = "Saved";
		}


		console.log(recipyName);
		recipyName.disabled = true;
		console.log(recipyName);
		//TODO: check if recipyName already exitst
		//const recipes = await $fetch(`/api/recipes/$(recipyName)`);
		console.log(recipes);

		value.Label = "Saved";

		let currentRecipy = {
			id: 0,
			name: 0,
			location: 0,
			description: 0,
			user: 0,
			thumbnail: 0,
		};

		let currentImage = {
			id: 0,
			url: 0,
			recipe: currentRecipy.id,
		};

		inputs.value.map(async (value, index, array) => {
			if (
				!(
					value.Ingredient == "" ||
					value.Amount == null ||
					value.Type == "" ||
					value.Category == ""
				)
			) {
				let currentValue = {
					id: "ZIEHA" + index, //id
					recipyId: 1, //recipyID
					ingredient: value.Ingredient, //ingredient
					amount: value.Amount, //amount
					type: value.Type.name, //type
					category: value.Category.name, //category
				};

				//data wordt in database gestoken
				const { body } = await $fetch("/api/ingredients", {
					method: "post",
					body: currentValue,
				});

				value.Label = "Saved";

				//TODO put a check next to the line so you know it is saved
			} else if (
				!(
					value.Ingredient == "" &&
					value.Amount == null &&
					value.Type == "" &&
					value.Category == ""
				)
			) {
				toast.add({
					severity: "error",
					summary: value.Ingredient,
					detail: "Missing values on row " + (index + 1) + "!",
					life: 3000,
				});
			}
		});

		toast.add({
			severity: "success",
			summary: "Saved",
			detail: "all new data is saved!",
			life: 3000,
		});
	}
}
</script>
