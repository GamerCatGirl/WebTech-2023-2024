<template>
  <div class="card">
    <Toolbar>
      <template #start>
        <Button
          label="Delete"
          icon="pi pi-times"
          severity="danger"
          class="mr-2"
        />

        <Button
          label="Cancel"
          icon="pi pi-history"
          severity="warning"
          class="mr-2"
        />
        <!-- 	
				<Button icon="pi pi-plus" class="mr-2" />
				<Button icon="pi pi-pencil" class="mr-2" />
				<Button icon="pi pi-print" class="mr-2" />
				-->
      </template>

      <template #end>
        <Button label="Save" icon="pi pi-check" class="mr-2" @click="save()" />
        <Button
          label="Publish"
          icon="pi pi-upload"
          class="mr-2"
          severity="success"
        />
      </template>
    </Toolbar>
  </div>

  <div class="card flex justify-content-center gap-3">
    <InputText
      placeholder="Recipy Name"
      v-model="recipyName"
      size="large"
      :disabled="false"
    />
    <!-- Put it in disabled mode when recipy already exists -->

    <InlineMessage severity="error">Recipy name is required</InlineMessage>

    <Button
      label="Fetch data"
      icon="pi pi-arrow-right-arrow-left"
      class="mr-2"
      @click="fetch()"
    />

    <!--TODO: make a hover that displays more information on the button -->
    <!-- Info to display: Gets all info of your recipy with this name so you can edit it -->
  </div>
  <div class="card flex justify-content-center gap-3">
    <Chip :label="uploaded" />

    <FileUpload
      mode="basic"
      name="demo[]"
      url="/api/upload"
      accept="image/*"
      :maxFileSize="1000000"
      @upload="onUpload"
      :auto="true"
      chooseLabel="Browse"
    />
  </div>

  <div class="card flex justify-content-center gap-3">
    <Image :src="image" height="250" preview />
  </div>

  <div class="card flex justify-content-center gap-3">
    <InputText placeholder="Thumbnail" v-model="thumbnail" />
    <InputText placeholder="Time" v-model="time" />
    <MultiSelect
      v-model="mealTypes"
      display="chip"
      :options="meals"
      :option-label="(meal) => meal.toString()"
      placeholder="Type of meals"
      :max-selected-labels="3"
    />

    <!-- Difficulty Recipy  -->
    <MultiSelect
      v-model="mealDifficulties"
      display="chip"
      :options="difficulties"
      :option-label="(difficulty) => difficulty.toString()"
      placeholder="Difficulty"
      :max-selected-labels="3"
    />

    <!--TODO: add location selector -->
  </div>

  <!-- Ingredients loop add -->
  <div class="card flex flex-column md:flex-row gap-3" v-for="input in inputs">
    <Chip :label="input.Label" v-model="input.new" />
    <!-- TODO: adding row numbers for error handling-->
    <!-- Name Ingredient -->
    <InputText
      placeholder="Ingredient Name"
      aria-labelledby="ingredient name"
      v-model="input.ingredient"
    />

    <!-- Amount -->
    <InputNumber v-model="input.amount" placeholder="Amount" />

    <!-- Select the type of amount -->
    <div class="card flex justify-content-center">
      <Dropdown
        editable
        :options="amountTypes"
        optionLabel="name"
        placeholder="Type"
        v-model="input.type"
        class="w-full md:w-14rem"
      />
    </div>

    <!-- Select a category -->
    <div class="card flex justify-content-center">
      <Dropdown
        editable
        :options="categoriesIngredients"
        optionLabel="name"
        v-model="input.category"
        placeholder="Category"
        class="w-full md:w-14rem"
      />
    </div>

    <Button
      icon="pi pi-times"
      :v-model="input.Counter"
      @click="deleteIngredient(input.Counter)"
      severity="danger"
    >
    </Button>
    <Toast />
    <Button icon="pi pi-plus" @click="addNewRow()"> </Button>
  </div>

  <div class="card">
    <Editor v-model="description" editorStyle="height: 320px" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { Meal, Difficulty } from "~/composables/recipes";
//definePageMeta({ middleware: 'auth', navigateUnauthenticatedTo: '/login?callbackUrl=/recipes/add' })

const recipyName = ref("");
let id = null;

const image = ref("../placeholder.svg");
const thumbnail = ref(); //displays a short message that you can use in the short view

const meals = Object.values(Meal);
const mealTypes = ref();
const difficulties = Object.values(Difficulty);
const mealDifficulties = ref();
const description = ref();
const time = ref();
let score = 0;

const toast = useToast();
const value = ref("");
const uploaded = ref("new");
const currentUserID = 2;

const categoriesIngredients = ref([
  { name: "Vegtable" },
  { name: "Meat" },
  { name: "Fish" },
]);

const amountTypes = ref([
  { name: "Pieces" },
  { name: "grams" },
  { name: "ml" },
]);

const amountType = ref();
const picture = ref({ url: "test.png" });

let counter = 0;
let amountDeleted = 0;
const inputs = ref([newDummy()]);

function newDummy() {
  return {
    Label: "New",
    ingredient: "",
    Counter: counter,
    category: "",
    amount: null,
    type: "",
  };
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

async function fetch() {
  let recipes = await $fetch(`/api/recipes`, {
    query: { user: currentUserID },
  });

  let exists = false;
  let recipyData = null;

  recipes.map((recipe) => {
    if (recipe.name == recipyName.value) {
      exists = true;
      recipyData = recipe;
    }
  });

  if (exists) {
    id = recipyData.id;
    //TODO: display toats to make sure they want to replace new data with old data

    //fill the data fields
    description.value = recipyData.description;

    console.log(mealDifficulties);
    mealDifficulties.value = recipyData.difficulty.name; //this doesn't work yet
    console.log(mealDifficulties.difficulty);

    thumbnail.value = recipyData.thumbnail;
    time.value = recipyData.time;

    mealTypes.value = recipyData.type.name; //this doesn't work yet
    score = recipyData.score;

    //fetch ingredients
    recipyData = await $fetch(`/api/recipes/${recipyData.id}`);
    console.log(recipyData);
    inputs.value = recipyData.ingredients;

    counter = 0;
    amountDeleted = 0;
    inputs.value.map((ingredient) => {
      console.log(ingredient);
      counter += 1;
      ingredient.Label = "Saved";
    });

    //TODO: fetch image
    let images = recipyData.images;
  } else {
    //trying to fetch a recipy that doesn't exists
    toast.add({
      severity: "error",
      summary: "No such recipe",
      detail: "You don't have a recipe with name: " + recipyName.value ,
      life: 3000,
    });
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

    //console.log(recipyName);
    recipyName.disabled = true; //TODO: this doesn't work yet
    //console.log(recipyName);
    let recipes = await $fetch(`/api/recipes`, {
      query: { user: currentUserID },
    });
    console.log(recipes);
    let exists = false;
    let recipeData = null;

    recipes.map((recipe) => {
      if (recipe.name == recipyName.value) {
        exists = true;
        recipeData = recipe;
        //TODO: delete recipy add all new values to it, but first give a warning
        //TODO: add old score to score value
      }
    });

    console.log("Recispy exists?: " + exists);
    console.log("Recipy UserID: " + currentUserID);
    let newRecipy = 0;

    if (!exists) {
      // Adding a new Recipy

      let { postRecipy } = await $fetch("/api/recipes", {
        method: "post",
        body: {
          name: recipyName.value,
          user: String(currentUserID), //TODO: change this to the logged in user
          //location: TODO: use geolocation api HTML5 to fill in this
          description: description.value,
          difficulty: mealDifficulties.value,
          thumbnail: thumbnail.value,
          time: time.value,
          type: mealTypes.value,
          score: score,
        },
      });
      let recipesOfUser = await $fetch(`/api/recipes`, {
        query: { user: currentUserID },
      });

      recipesOfUser.map((recipe) => {
        if (recipe.name == recipyName.value) {
          newRecipy = recipe;
        }
      });
    } else {
      //recipy does exists
      id = recipeData.id;
    }

    value.Label = "Saved";

    let currentImage = {
      id: 0,
      url: 0,
      recipe: newRecipy.id,
    };

    inputs.value.map(async (value, index, array) => {
      if (
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
          recipyId: newRecipy.id, //recipyID
          ingredient: value.ingredient, //ingredient
          amount: value.amount, //amount
          type: value.type.name, //type
          category: value.category.name, //category
        };

        //data wordt in database gestoken
        const { body } = await $fetch("/api/ingredients", {
          method: "post",
          body: currentValue,
        });

        value.Label = "Saved";
      } else if (
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

    toast.add({
      severity: "success",
      summary: "Saved",
      detail: "all new data is saved!",
      life: 3000,
    });
  }
}
</script>
