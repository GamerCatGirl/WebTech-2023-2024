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

	<div class="card flex justify-content-center">
		<InputText placeholder="Recipy Name" v-model="recipyName" />
		<FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000"
			@upload="onUpload" :auto="true" chooseLabel="Browse" />
	</div>

	<div class="card flex flex-column md:flex-row gap-3" v-for="input in inputs">
		<!-- Name Ingredient -->
		<InputText placeholder="Ingredient Name" v-model="input.Ingredient" />

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

	<!-- ADD TO RECIPY/ ID
  <div class="card">
    <TabView>
      <TabPanel header="Header I">
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </TabPanel>
      <TabPanel header="Header II">
        <p class="m-0">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit,
          sed quia non numquam eius modi.
        </p>
      </TabPanel>
      <TabPanel header="Header III">
        <p class="m-0">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
          et quas molestias excepturi sint occaecati cupiditate non provident,
          similique sunt in culpa qui officia deserunt mollitia animi, id est
          laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
          distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
          cumque nihil impedit quo minus.
        </p>
      </TabPanel>
    </TabView>
  </div>
-->

	<div class="card">
		<Editor v-model="value" editorStyle="height: 320px" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const recipyName = ref("");

const toast = useToast();
const value = ref("");
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

const onUpload = () => {
	toast.add({
		severity: "info",
		summary: "Success",
		detail: "File Uploaded",
		life: 3000,
	});
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

function save() {
	//to implement

	if (recipyName.value == "") {
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Fill in the Recipy Name",
			life: 3000,
		});
	} else {
		inputs.value.map((value, index, array) => {

			if (
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
					detail: "lol",
					life: 3000,
				});

				
				}

			});

		/* if (value.Ingredient == "") {
				    toast.add({
					    severity: "error",
					    summary: value.Ingredient,
					    detail: "lol",
					    life: 3000,
				    }),
						    } else if (value.Amount == null) {
				    toast.add({
					    severity: "error",
					    summary: value.Ingredient,
					    detail: "lol",
					    life: 3000,
				    }),
						    } else if (value.Type == "") {
				    toast.add({
					    severity: "error",
					    summary: value.Ingredient,
					    detail: "lol",
					    life: 3000,
				    }),
	    
						    } else if (value.Category == "") {
	    
				    toast.add({
					    severity: "error",
					    summary: value.Ingredient,
					    detail: "lol",
					    life: 3000,
				    }),
						    } else {
				    toast.add({
					    severity: "error",
					    summary: value.Ingredient,
					    detail: "lol",
					    life: 3000,
				    }),
	    
				    //push into dataBase
			    } */

		//const recipyName = ref();
	}
}
</script>
