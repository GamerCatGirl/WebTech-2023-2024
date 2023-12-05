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
        <Button label="Save" icon="pi pi-check" class="mr-2" @click="save(toast)" />
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
      v-model="inputRecipeName"
      size="large"
      :disabled="false"
    />
    <!-- Put it in disabled mode when recipy already exists -->

    <InlineMessage severity="error">Recipy name is required</InlineMessage>

    <Button
      label="Fetch data"
      icon="pi pi-arrow-right-arrow-left"
      class="mr-2"
      @click="fetchRecipe(toast)"
    />

    <!--TODO: make a hover that displays more information on the button -->
    <!-- Info to display: Gets all info of your recipy with this name so you can edit it -->
  </div>
  <div class="card flex justify-content-center gap-3">
    <Chip :label="infoImage" />

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
    <InputText placeholder="Thumbnail" v-model="inputThumbnail" />
    <InputText placeholder="Time" v-model="inputTime" />
    <MultiSelect
      v-model="selectedTypes"
      display="chip"
      :options="meals"
      :option-label="(meal) => meal.toString()"
      placeholder="Type of meals"
      :max-selected-labels="3"
    />

    <!-- Difficulty Recipy  -->
    <MultiSelect
      v-model="selectedDifficulties"
      display="chip"
      :options="difficulties"
      :option-label="(difficulty) => difficulty.toString()"
      placeholder="Difficulty"
      :max-selected-labels="3"
    />

    <!--TODO: add location selector -->
  </div>

  <!-- Ingredients loop add -->
  <div class="card flex flex-column md:flex-row gap-3" v-for="input in inputsIngredients">
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
        :options="ingredients"
        optionLabel="name"
        v-model="input.category"
        placeholder="Category"
        class="w-full md:w-14rem"
      />
    </div>

    <Button
      icon="pi pi-times"
      :v-model="input.Counter"
      @click="deleteRowIngredients(input.Counter, toast)"
      severity="danger"
    >
    </Button>
    <Toast />
    <Button icon="pi pi-plus" @click="addRowIngredients()"> </Button>
  </div>

  <div class="card">
    <Editor v-model="inputDescription" editorStyle="height: 320px" />
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { inputRecipeName, image, inputThumbnail, inputDescription, inputTime, scoreRecipe, 
       meals, difficulties, amountTypes, ingredients, addRowIngredients, deleteRowIngredients,inputsIngredients,
       selectedTypes, selectedDifficulties, save,
	infoImage, fetchRecipe
       } from "~/composables/edit_add"
//definePageMeta({ middleware: 'auth', navigateUnauthenticatedTo: '/login?callbackUrl=/recipes/add' })
const toast = useToast();

//TODO: you cannot upload multiple mealtypes to database 

//let scoreRecipe = 0;

const currentUserID = 2;

let counter = 0;
//const inputs = ref([newDummy()]);




const onUpload = (event) => {
  image.value = event.files[0].objectURL;
};


</script>
