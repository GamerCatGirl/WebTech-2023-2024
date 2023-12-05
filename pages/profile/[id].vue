<script setup lang="ts">
/*definePageMeta({
    name:"testlalal1", //verandert enkel wat na "/profile" komt, wordt overschreven als onderste twee defined zijn
    //alias:"/elycodeert", //verandert heel de path of na '/profile'
    title: 'Blablabla'
})*/

const { id } = useRoute().params
useHead({
  titleTemplate: '' + id
})
const value = ref(3);

</script>

<template>
  <div class="flex align-items-center">
    <Card class="profileCard">
      <template #header>
        <img alt="user header" src="Tiramisu.png" />
      </template>
      <template #title> {{ id }} </template>
      <template #subtitle>
        @mail <br />
        Based in flag <br />
        <p class="info">Followers: 5, Following: 20</p>
        <Button icon="pi pi-user-plus" label="FIND USERS" />
        <Button icon="pi pi-upload" />
      </template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>
      </template>
      <template #footer> User since ... </template>
    </Card>

    <Card class="profileCard">
      <template #title> Settings </template>
      <template #content> 
        <Button @click="navigateTo('edit')">
          Edit profile
        </Button>
      </template>
    </Card>
  </div>

  <Card>
    <template #title> My Recipies </template>
    <template #content>
      <div class="card flex justify-content-center gap-2">
        <Card>
          <template #title> Tiramisu </template>
          <template #content>
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

        <Card>
          <template #title> Tiramisu </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag value="Dessert"></Tag>
              <Tag icon="" value="Easy"></Tag>
              <Tag icon="pi pi-clock" value="'30" severity="warning" rounded></Tag>
            </div>

            <!--Insert a picture-->
            <div class="card flex justify-content-center">
              <Image src="Tiramisu.png" alt="Image" width="200" />
            </div>

            <p class="m-0">Made by @Silken</p>
            <!-- Display kind of recipy: dessert, lunch, ...--->
            <!--Display figures like meat, vegi, halal, vegan, ...-->
            <!-- Display the time and dificulty-->
            <!--Display de rating -->
            <div class="card">
              <Rating v-model="value" readonly :cancel="false" />
            </div>
          </template>
        </Card>

        <Card>
          <template #title> Tiramisu </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag value="Dessert"></Tag>
              <Tag icon="" value="Easy" severity="success"></Tag>
              <Tag icon="pi pi-clock" value="'60" severity="danger" rounded></Tag>
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

      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </p>
    </template>

  </Card>

  <Card>
    <template #title> Saved Recipies </template>
    <template #content>


      <div class="card flex justify-content-center gap-2">
        <Card>
          <template #title> Tiramisu </template>
          <template #content>
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

        <Card>
          <template #title> Tiramisu </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag value="Dessert"></Tag>
              <Tag icon="" value="Easy"></Tag>
              <Tag icon="pi pi-clock" value="'30" severity="warning" rounded></Tag>
            </div>

            <!--Insert a picture-->
            <div class="card flex justify-content-center">
              <Image src="Tiramisu.png" alt="Image" width="200" />
            </div>

            <p class="m-0">Made by @Silken</p>
            <!-- Display kind of recipy: dessert, lunch, ...--->
            <!--Display figures like meat, vegi, halal, vegan, ...-->
            <!-- Display the time and dificulty-->
            <!--Display de rating -->
            <div class="card">
              <Rating v-model="value" readonly :cancel="false" />
            </div>
          </template>
        </Card>

        <Card>
          <template #title> Tiramisu </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag value="Dessert"></Tag>
              <Tag icon="" value="Easy" severity="success"></Tag>
              <Tag icon="pi pi-clock" value="'60" severity="danger" rounded></Tag>
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

      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </p>
    </template>

  </Card>
</template>

<style>
.info {
  color: white;
  font-weight: bold;
}

.profileCard {
  width: 50%;
}
</style>


