<template>
  <div class="card">
    <Steps :model="items" :readonly="false" />
  </div>

  <Card class="InfoCard" v-show="InfoCard">
    <template #title> {{ recipyName }} </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <Tag value="Dessert"></Tag>
        <Tag icon="" value="Easy" severity="success"></Tag>
        <Tag icon="pi pi-clock" value="'15" severity="success" rounded></Tag>
      </div>

      <!--Insert a picture-->
      <div class="card flex">
        <Image
          class="imageCard"
          src="../Tiramisu.png"
          alt="Image"
          width="auto"
        />
      </div>

      <p class="m-0">Made by @Silken</p>
      <!-- Display kind of recipy: dessert, lunch, ...--->
      <!--Display figures like meat, vegi, halal, vegan, ...-->
      <!-- Display the time and dificulty-->
      <!--Display de rating -->
      <div class="card flex">
        <Rating v-model="text" readonly :cancel="false" class="flex gap-2" />
      </div>
    </template>

    <!-- TODO: put vertical bar in card and in the right a pin on the map of the recipy -->
  </Card>

  <div class="card InfoCard" v-show="Ingredients">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      ></Column>
    </DataTable>
  </div>

  <div class="card" v-show="RecipyText">
    <Editor v-model="value" editorStyle="height: 320px" readonly />
  </div>

  <div v-show="Comments">
    <Divider align="right" type="solid">
      <b>Username</b>
    </Divider>

    <p class="m-0">
      Temporibus autem quibusdam et aut officiis debitis aut rerum
      necessitatibus saepe eveniet ut et voluptates repudiandae sint et
      molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
      delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
      perferendis doloribus asperiores repellat. Donec vel volutpat ipsum.
      Integer nunc magna, posuere ut tincidunt eget, egestas vitae sapien. Morbi
      dapibus luctus odio.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ingredients } from "~/database/ingredients";

const value = ref(3);
const text = ref("Test test");
const route = useRoute();
const id = route.params.id;
const comboRouting = "&";
const splitedId = id.split(comboRouting);
const recipyName = splitedId[0];
const recipyID = splitedId[1];
const products = ref([
  {
    ingredient: "Mascarpone",
    amount: 500,
    type: "grams",
    category: "dairy products",
  },
]);
const columns = [
  { field: "ingredient", header: "Ingredient" },
  { field: "amount", header: "Amount" },
  { field: "type", header: "Type" },
  { field: "category", header: "Category" },
];

console.log(splitedId);
console.log(recipyName);
console.log(recipyID);
const InfoCard = ref(true);
const Ingredients = ref(false);
const RecipyText = ref(false);
const Comments = ref(false);

const items = ref([
  {
    label: "Info",
    command: () => {
      InfoCard.value = true;
      Ingredients.value = false;
      RecipyText.value = false;
      Comments.value = false;
    },
  },
  {
    label: "Ingredients",
    command: () => {
      InfoCard.value = false;
      Ingredients.value = true;
      RecipyText.value = false;
      Comments.value = false;
    },
  },
  {
    label: "Steps",
    command: () => {
      InfoCard.value = false;
      Ingredients.value = false;
      RecipyText.value = true;
      Comments.value = false;
    },
  },
  {
    label: "Comments",
    command: () => {
      InfoCard.value = false;
      Ingredients.value = false;
      RecipyText.value = false;
      Comments.value = true;
    },
  },
]);

//const recipyName
</script>

<style>
.InfoCard {
  width: 80%;
  margin: auto;
}

.imageCard {
  width: 10%;
}
</style>
