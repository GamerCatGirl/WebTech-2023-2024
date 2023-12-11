import {
	Meal,
	Difficulty,
	Ingredients,
	AmountTypes,
} from "~/composables/recipes";

//selectors data


export const amountTypes = ref(["Pieces", "grams", "ml"]);

//buttons

//inputs for recipy
export const inputRecipeName = ref();
export const image = ref("/placeholder.svg");
export const inputThumbnail = ref();
export const inputTime = ref();
export const selectedTypes = ref();
export const selectedDifficulties = ref();
export const inputDescription = ref();

//messages
export const infoImage = ref("new");

//data from database
export let idRecipe = null;
export let scoreRecipe = null;
export let recipe = null;
export let user = null;
export let userID = null;

export function setUserID(id) {
	userID = String(id);
}

//Ingredients row
let amountAdded = 0;
let amountDeleted = 0;

function newDummy() {
	return {
		Label: "New",
		ingredient: "",
		Counter: amountAdded,
		category: "",
		amount: null,
		type: "",
	};
}

export const inputsIngredients = ref([]);

export function addRowIngredients() {
	amountAdded += 1;
	inputsIngredients.value.push(newDummy());
}

export function deleteRowIngredients(idString, toast) {
	//checken dat ref niet leeg wordt, anders error throwen met toast
	const id = Number(idString);

	//add a confirmationDialog

	if (amountAdded == amountDeleted) {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Add a new row before removing this one",
			life: 3000,
		});
	} else {
		inputsIngredients.value.splice(id - amountDeleted, 1);
		amountDeleted += 1;
	}
}

//reset values
export function resetVariables() {
	inputRecipeName.value = null;
	image.value = "/placeholder.svg";
	inputThumbnail.value = null;
	inputTime.value = null;
	selectedTypes.value = null;
	selectedDifficulties.value = null;
	inputDescription.value = null;
	infoImage.value = "new";

	idRecipe = null;
	scoreRecipe = null;
	recipe = null;
	user = null;
	userID = null;

	amountAdded = 0;
	amountDeleted = 0;
	inputsIngredients.value = [newDummy()];
}

export async function getRecipe() {
	//TODO: @Merlijn ik krijg hier alle recipes en niet enkel die van de userID
	const recipes = await $fetch(`/api/recipes`, { query: { user: userID } });

	recipes.map((recipeDatabase) => {
		if (recipeDatabase.name == inputRecipeName.value) {
			recipe = recipeDatabase;
		}
	});

	if (!(recipe === null)) {
		recipe = await $fetch(`/api/recipes/${recipe.id}`);
	}

	return recipe;
}

function errorNoSuchRecipe(toast) {
	toast.add({
		severity: "error",
		summary: "No such recipe",
		detail: "You don't have a recipe with name: " + inputRecipeName.value,
		life: 3000,
	});
}

function errorFillInRecipeName(toast) {
	toast.add({
		severity: "error",
		summary: "Fill in the 'Recipe Name'",
		life: 3000,
	});
}

export function putData() {
	inputThumbnail.value = recipe.thumbnail;
	idRecipe = recipe.id;
	inputDescription.value = recipe.description;

	selectedDifficulties.value = recipe.difficulty.name; //this doesn't work yet

	inputTime.value = recipe.time;

	selectedTypes.value = recipe.type.name; //this doesn't work yet
	scoreRecipe = recipe.score;

	inputsIngredients.value = recipe.ingredients;

	amountAdded = 0;
	amountDeleted = 0;
	inputsIngredients.value.map((ingredient) => {
		amountAdded += 1;
		ingredient.Label = "Saved";
	});

	//TODO: image
	console.log(image);
	image.value = recipe.images;
}

export async function fetchRecipe(toast) {
	await getRecipe();
	if (inputRecipeName.value == null) {
		errorFillInRecipeName(toast);
	} //recipy name empty
	else if (recipe === null) {
		errorNoSuchRecipe(toast);
	} //recipy doesn't exist
	else {
		// TODO: redirect naar edit
		putData();
	} //recipy found
}

async function update(toast) {
	console.log("need to update the recipy");
	// TODO: kijk op drizzle of er een update data function bestaat
	// TODO: delete data
	// TODO: save data
}

async function saveIngredients(toast) {
	inputsIngredients.value.map(async (value, index) => {
		if (
			//alle values zijn ingevuld
			!(
				value.ingredient == "" ||
				value.amount == null ||
				value.type == "" ||
				value.category == "" ||
				value.Label == "Saved"
			)
		) {
			let currentValue = {
				//id: "ZIEHA" + index, //TODO: automatische handler aanzetten
				recipyId: recipe.id, //recipyID
				ingredient: value.ingredient, //ingredient
				amount: value.amount, //amount
				type: value.type.name, //type
				category: value.category.name, //category
			};

			//data wordt in database gestoken
			await $fetch("/api/ingredients", {
				method: "post",
				body: currentValue,
			});

			value.Label = "Saved";
		} else if (
			//niet alle values zijn ingevuld
			!(
				(value.ingredient == "" &&
					value.amount == null &&
					value.type == "" &&
					value.category == "") ||
				value.Label == "Saved"
			)
		) {
			toast.add({
				severity: "error",
				summary: value.ingredient,
				detail: "Missing values on row " + (index + 1) + "!",
				life: 3000,
			});
		}
	});
}

/**
 * Saves the data
 *
 * @async
 * @returns {Promise<boolean>} Whether or not the saving was succesful
 */
async function saveData(toast) {
	let newRecipe = {
		name: inputRecipeName.value,
		location: null,
		recipe: inputDescription.value,
		description: inputThumbnail.value,
		thumbnail: image.value,
		time: inputTime.value,
		type: selectedTypes.value,
		difficulty: selectedDifficulties.value,
		score: null,
	};

	const res = await useFetch("/api/recipes", {
		method: "post",
		body: newRecipe,
	});
	if (res.status.value === "error" && res.error.value?.statusCode === 400) {
		toast.add({
			severity: "error",
			detail: res.error.value?.data.message,
			life: 3000,
		});
	 	return false
	}

	//so we can acces recipe
	await getRecipe();

	// TODO: put Ingredients
	saveIngredients(toast);
	return true
}

export async function save(toast) {
	await getRecipe();
	if (inputRecipeName.value == null) {
		errorFillInRecipeName(toast);
	} //recipy name empty
	else if (recipe === null) {
		if (!await saveData(toast)) return

		toast.add({
			severity: "success",
			summary: "Saved",
			detail: "all data is saved!",
			life: 3000,
		});
	} //recipy doesn't exist
	else {
		//recipy exists already
		// TODO: toats accept overwrite data
		// TODO: update data
		update(toast);
	} //recipy found
}
