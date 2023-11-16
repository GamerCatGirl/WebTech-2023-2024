<template>
  <div class="card">
    <Toolbar>
      <template #start>
        <Button icon="pi pi-plus" class="mr-2" />
        <Button icon="pi pi-print" class="mr-2" />
        <Button icon="pi pi-upload" />
      </template>

      <template #center>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText placeholder="Search" />
        </span>
      </template>

      <template #end>
        <SplitButton
          label="Save"
          icon="pi pi-check"
          :model="items"
        ></SplitButton>
      </template>
    </Toolbar>
  </div>

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

  <div class="card">
    <Editor v-model="value" editorStyle="height: 320px" />
  </div>
</template>

<script setup>
import { ref } from "vue";
const value = ref("");
const items = ref([
  {
    label: "Update",
    icon: "pi pi-refresh",
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
]);
</script>
