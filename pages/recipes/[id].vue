<template>
  <div class="card">
    <Steps :model="items" :readonly="false" />
  </div>

  <Card class="InfoCard" v-show="InfoCard">
    <template #title> {{ recipyName }} </template>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <Tag :value="recipy.type"></Tag>
        <Tag
          icon=""
          :value="recipy.difficulty"
          :severity="getColorDifficulty(recipy.difficulty)"
        ></Tag>
        <Tag
          icon="pi pi-clock"
          :value="recipy.time"
          :severity="getSeverity(recipy.time)"
          rounded
        ></Tag>
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
      <!--Display figures like meat, vegi, halal, vegan, ...-->
      <div class="card flex">
        <Rating
          v-model="recipyScore"
          readonly
          :cancel="false"
          class="flex gap-2"
        />
      </div>
    </template>

    <!-- TODO: put vertical bar in card and in the right a pin on the map of the recipy -->
  </Card>

  <div class="card InfoCard" v-show="Ingredients">
    <DataTable :value="ingredients" tableStyle="min-width: 50rem">
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

  <!-- TODO: fix the layout of this horizontal bar -->
  <div v-show="Comments">
    <!-- input text -->
    <Textarea v-model="addComment" rows="1" cols="90" />
    <!-- TODO: make this dynamic!!!! -->
    <!--  cancel button -->
    <Button label="Cancel" severity="warning" rounded />
    <!--  comment button -->
    <Button label="Comment" severity="success" @click="comment()" rounded>
    </Button>

    <div v-for="comment in comments">
      <Divider align="right" type="solid">
        <b>Username</b>
      </Divider>

      <p class="m-0">
        {{ comment.comment }}
      </p>

      <div class="flex gap-5">
        <div class="flex justify-content-left">
          <!-- like button -->
          <Button icon="pi pi-thumbs-up" severity="success" rounded />
          <!-- amount of likes -->

          <span class="amountStyle">{{ comment.likes }}</span>
          <!-- dislike button -->

          <Button icon="pi pi-thumbs-down" severity="danger" rounded />
          <!-- answer button -->
        </div>
        <div class="flex justify-content-right">
          <!--TODO: flex right doesn't work here-->

          <Textarea v-model="addReaction" rows="1" cols="90" />
          <Button label="Answer" rounded />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const value = ref(3); //score of recipy still needs to be added in the database
const route = useRoute();
const id = route.params.id;
const comboRouting = "&";
const splitedId = id.split(comboRouting);
const recipyID = splitedId[1];

const recipy = await $fetch(`/api/recipes/${id}`);
const recipyScore = ref(Number(recipy.score));

console.log(recipy.comments);
const comments = ref(recipy.comments);
//const allIngredients = await $fetch(`/api/ingredients`);

const recipyName = recipy.name;
const text = ref(recipy.thumbnail);

console.log("recipy name");
console.log(recipyName);

console.log("recipy score: " + recipy.score);

console.log(recipy);

const ingredients = recipy.ingredients;
console.log(ingredients);

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

function getSeverity(time) {
  if (time < 30) {
    return "success";
  } else if (time < 60) {
    return "warning";
  } else {
    return "danger";
  }
}

function getColorDifficulty(difficulty) {
  if (difficulty === "Easy") {
    return "success";
  } else if (difficulty === "Medium") {
    return "warning";
  } else {
    return "danger";
  }
}

const addComment = ref();

async function comment() {
  let comment = addComment.value;
  console.log("Publishing comment: " + comment);
  console.log("RecipyID: " + id);

  let commentData = {
    comment: comment,
    commentAnswer: "",
    recipe: id,
  };

  const { postComment } = await $fetch("/api/comments", {
    method: "post",
    body: commentData,
  });

  comments.value.unshift(commentData);

  //TODO: clear the input bar
  //return "hallo";
}

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

.amountStyle {
  font-size: 35px;
}
</style>
