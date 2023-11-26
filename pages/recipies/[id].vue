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
        <Rating v-model="value" readonly :cancel="false" class="flex gap-2" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";

const value = ref(3);
const route = useRoute();
const id = route.params.id;
const comboRouting = "&";
const splitedId = id.split(comboRouting);
const recipyName = splitedId[0];
const recipyID = splitedId[1];
console.log(splitedId);
console.log(recipyName);
console.log(recipyID);
const InfoCard = ref(true);

const items = ref([
  {
    label: "Info",
    command: () => {
    	InfoCard.value = true;
    },
  },
  {
    label: "Ingredients",
    command: () => { 
    	InfoCard.value = false;
    },
  },
  {
    label: "Steps",
    command: () => {
    	InfoCard.value = false;
    }
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
