<script setup lang="ts">
import { ref } from "vue";
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { Recipe } from "~/database/recipe";
import { Meal, Difficulty } from "~/composables/recipes";

function getParamArray(
  array: LocationQueryValue | LocationQueryValue[] | undefined,
): LocationQueryValue[] {
  if (!array) return [];
  else if (Array.isArray(array)) return array;
  else return [array];
}

interface sortOption {
  label: String;
  sort: String;
  field: String | ((recipe: Recipe) => number);
  order: 1 | -1;
}

const sortOptions: sortOption[] = [
  {
    label: "Difficulty hard to easy",
    sort: "difficulty",
    field: ({ difficulty }) => sortDifficulty(difficulty as Difficulty),
    order: -1,
  },
  {
    label: "Difficulty easy to hard",
    sort: "difficulty",
    field: ({ difficulty }) => sortDifficulty(difficulty as Difficulty),
    order: 1,
  },
  { label: "Rating best to worst", sort: "score", field: "score", order: -1 },
  { label: "Rating worst to best", sort: "score", field: "score", order: 1 },
  { label: "Time shortest to longest", sort: "time", field: "time", order: 1 },
  { label: "Time longest to shortest", sort: "time", field: "time", order: -1 },
];

const input = ref("");
const route = useRoute();
const queryParams = route.query;
const query = ref((queryParams.query?.valueOf() as string) || "");
const page = ref(parseInt(queryParams.page?.valueOf() as string) || 0);
const pageSize = 20;
const mealTypes = ref(getParamArray(queryParams.mealType));
const mealDifficulties = ref(getParamArray(queryParams.mealDifficulty));
const sortKey: Ref<sortOption | undefined> = ref(undefined);
const sortField = ref("");
const sortOrder = ref(1);
if (queryParams.sort && queryParams.sortOrder) {
  sortKey.value = sortOptions.find(({ sort, order }) => {
    return (
      parseInt(queryParams.sortOrder?.valueOf() as string) === order &&
      queryParams.sort?.valueOf() === sort
    );
  });
  if (sortKey.value) {
    sortOrder.value = sortKey.value.order;
    // @ts-ignore
    sortField.value = sortKey.value.field;
  }
}
if (query.value) input.value = query.value;

let debounceTimeout: NodeJS.Timeout;
function updateURL() {
  const queryParams: LocationQuery = {};
  if (input.value) queryParams.query = input.value;
  if (page.value && page.value !== 0) queryParams.page = page.value.toString();
  if (mealTypes.value) queryParams.type = mealTypes.value;
  if (mealDifficulties.value) queryParams.difficulty = mealDifficulties.value;
  if (sortKey.value) {
    // @ts-ignore
    queryParams.sort = sortKey.value.sort;
    // @ts-ignore
    queryParams.sortOrder = sortKey.value.order;
  }
  navigateTo({ path: route.path, query: queryParams, replace: true });
}
watch(input, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    query.value = input.value;
    updateURL();
  }, 500);
});
watch([mealDifficulties, mealTypes, page], updateURL, { deep: true });

const layout: Ref<"list" | "grid" | undefined> = ref("list");

const { data } = await useFetch("/api/recipes", {
  query: {
    query,
    page,
    size: pageSize,
    difficulty: mealDifficulties,
    mealType: mealTypes,
    highStart: "<b>",
    highEnd: "</b>",
  },
});
const recipes = computed(
  () =>
    data.value?.map((value) => {
      // @ts-ignore
      const recipe = value as Recipe;
      const hours = Math.floor((recipe.time ?? 0) / 60);
      const minutes = (recipe.time ?? 0) % 60;
      const cookTime =
        (hours ? hours + "h" : "") + (minutes ? minutes + "m" : "");
      const name = recipe.name.replaceAll(/<\/?b>/g, "");
      const descList = recipe.description?.split(/<\/?b>/) ?? [];
      const totalAmount: number = value.totalAmount;
      return { ...recipe, name, totalAmount, descList, cookTime };
    }) ?? [],
);
const meals = Object.values(Meal);
const difficulty = Object.values(Difficulty);

function sortDifficulty(difficulty: Difficulty) {
  return difficulty === Difficulty.Easy
    ? 1
    : difficulty === Difficulty.Medium
      ? 2
      : 3;
}


const dataView = ref(true);
const map = ref(false);
const viewButton = ref(true);


function viewOnMap() {
  dataView.value = false;
  map.value = true;

}

function sort(event: { originalEvent: Event; value: any }) {
  const sortValue = event.value;
  if (sortValue == null) {
    sortOrder.value = 0;
    sortField.value = "";
    sortKey.value = undefined;
  } else {
    sortOrder.value = sortValue.order;
    sortField.value = sortValue.field;
    sortKey.value = sortValue;
  }
}

const zoom = ref(6);
</script>

<template>
  <div>
    <div class="card flex justify-content-left">
      <Button v-show="viewButton" label="View on map" icon="pi pi-compass" @click="viewOnMap()" />
    </div>

    <div v-if="map" style="height: 80vh; width: 50vw">

      <LMap ref="map" :zoom="zoom" :center="[47.21322, -1.559482]">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          layer-type="base"
          name="OpenStreetMap"
        />
      </LMap>
    </div>

    <div v-show="dataView">
      <DataView
        :value="recipes"
        :rows="pageSize"
        :layout="layout"
        :sort-field="sortField"
        :sort-order="sortOrder"
        data-key="1"
      >
        <template #header>
          <div>
            <span class="p-input-icon-left search">
              <i class="pi pi-search" />
              <InputText
                v-model="input"
                type="text"
                placeholder="Search recipes..."
              />
            </span>
            <MultiSelect
              v-model="mealTypes"
              display="chip"
              :options="meals"
              :option-label="(meal) => meal.toString()"
              placeholder="Type of meals"
              :max-selected-labels="3"
            />

            <MultiSelect
              v-model="mealDifficulties"
              display="chip"
              :options="difficulty"
              :option-label="(difficulty) => difficulty.toString()"
              placeholder="Difficulty"
              :max-selected-labels="3"
              class="w-full md:w-20rem"
            />
            <Dropdown
              :model-value="sortKey"
              option-label="label"
              placeholder="Sort by ..."
              :options="sortOptions"
              show-clear
              @change="sort($event)"
            />
          </div>
        </template>
        <template #list="{ data: recipe }">
          <Card>
            <!-- <template #title> {{ data.name }} </template> -->
            <template #title>
              <nuxtLink :to="'/recipes/' + recipe.id">
                {{ recipe.name }}
              </nuxtLink>
              <br />
              <Tag
                icon="pi pi-clock"
                :value="recipe.cookTime"
                severity="info"
                rounded
              />
              <Tag
                icon=""
                :value="recipe.difficulty"
                :severity="
                  recipe.difficulty == Difficulty.Easy
                    ? 'success'
                    : recipe.difficulty == Difficulty.Medium
                      ? 'warning'
                      : 'danger'
                "
              />
              <Tag :value="recipe.type" />
            </template>
            <template #subtitle
              >Made by
              <NuxtLink :to="'/profile/' + recipe.user">{{
                recipe.userName
              }}</NuxtLink>
            </template>
            <template #header>
              <nuxtLink :to="'/recipes/' + recipe.id">
	      <Image src="" />
              </nuxtLink>
            </template>

            <template #content>
              <template
                v-for="(description, index) in recipe.descList"
                :key="index"
              >
                <b v-if="index % 2 == 1">{{ description }}</b>
                <template v-else>{{ description }}</template>
              </template>
            </template>
            <template #footer>
              <Rating
                v-model="recipe.score"
                readonly
                :cancel="false"
                class="flex gap-2"
              />
            </template>
          </Card>
        </template>
        <template #footer>
          <Paginator
            :always-show-paginator="false"
            :rows="pageSize"
            :total-records="recipes[0]?.totalAmount ?? 0"
            @page="($event) => (page = $event.page)"
          />
        </template>
      </DataView>
      <p v-if="recipes?.length == 0">No recipes found</p>
    </div>
  </div>
</template>

<style scoped>
.p-grid {
  display: flex;
}

.p-dataview .p-card {
  width: 13em;
  max-width: 30em;
  margin: 10px;
  flex-grow: 1;
}

.p-card-header .p-image {
  display: inline-block;
  width: 100%;
}

:deep(.p-card-content p) {
  max-height: 20em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 15;
  overflow: hidden;
}

.p-card-title .p-tag {
  margin-right: 2px;
}

:deep(.p-card-header .p-image img) {
  width: 100%;
  border-radius: var(--border-radius) var(--border-radius) 0px 0px;
}

.search,
.p-inputtext {
  width: 100%;
}

.p-multiselect {
  margin: 5px;
  margin-left: 0px;
}

a {
  color: inherit;
  text-decoration: inherit;
}
</style>
