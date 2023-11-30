<script setup lang="ts">
/*definePageMeta({
    name:"testlalal1", //verandert enkel wat na "/profile" komt, wordt overschreven als onderste twee defined zijn
    //alias:"/elycodeert", //verandert heel de path of na '/profile'
    title: 'Blablabla'
})*/

const { id } = useRoute().params
useHead({
  titleTemplate: id
})

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
      <template #content> </template>
    </Card>
  </div>

  <Card>
    <template #title> My Recipies </template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </p>
    </template>
    <template #footer> Footer </template>
  </Card>

  <Card>
    <template #title> Saved Recipies </template>
    <template #content>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </p>
    </template>
    <template #footer> Footer </template>
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
