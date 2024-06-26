<script setup lang="ts">
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import { LocationQuery, useRoute } from "vue-router";
import { Recipe } from "~/database/recipe";
import { Meal, Difficulty } from "~/composables/recipes";

const props = withDefaults(
  defineProps<{
    /**
     * This function should return the recipes that should be shown by the list
     *
     * @param query The query to search on
     * @param page What page of results we are on
     * @param size The size of the pages we are requesting
     * @param difficulty The difficulty of the results we are searching on
     * @param mealType The type of meals we are searching for
     * @param sortOn What to attribute to sort on
     * @param sort How to sort this attribute
     *
     * @returns The promise of the recipes that match these search queries
     */
    getRecipes: (
      query: Ref<string>,
      page: Ref<number>,
      size: number,
      difficulty: Ref<Difficulty[]>,
      mealType: Ref<Meal[]>,
      sortOn: Ref<string>,
      sortOrder: Ref<number>,
    ) => Promise<
      Ref<{
        recipes: (Recipe & { userName: string | undefined })[];
        totalAmount: number;
      }>
    >;
    /**
     * Whether or not to highlight the matches that match the `query` parameter given to `getRecipes`.
     *
     * If this is set to `true`, the returned recipes should have a description where the matches are surrounded by `b` tags.
     * If you are using `/api/recipes` as the api, you can set `highStart` to `<b>` and `highEnd` to `</b>` when sending the request, this will surround your matches with `b` tags automatically.
     */
    highlightMatches?: boolean;
    /** The query to search on */
    initialQuery?: string;
    /** The amount of recipes to display per page */
    pageSize?: number;
    /** The current page */
    initialPage?: number;
    /** The meals on which to filter */
    initialMealTypes?: Meal[];
    /** the difficulties on which to filter */
    initialMealDifficulties?: Difficulty[];
    /** Whether or not to hide the username on the recipes */
    hideUsername?: boolean;
  }>(),
  {
    highlightMatches: false,
    initialQuery: "",
    pageSize: 20,
    initialPage: 0,
    initialMealTypes: () => [],
    initialMealDifficulties: () => [],
  },
);
const emits = defineEmits<{
  /** This event is fired when the search parameters change, this can for example be used to encode these parameters inside of the URL */
  queryParametersChanged: [queryParameters: LocationQuery];
}>();

interface sortOption {
  label: string;
  sort: string;
  order: 1 | -1;
}

const sortOptions: sortOption[] = [
  { label: "Rating best to worst", sort: "score", order: -1 },
  { label: "Rating worst to best", sort: "score", order: 1 },
  { label: "Time shortest to longest", sort: "time", order: 1 },
  { label: "Time longest to shortest", sort: "time", order: -1 },
  { label: "Newest to oldest", sort: "createdAt", order: -1 },
  { label: "Oldest to newest", sort: "createdAt", order: 1 },
];

const input = ref("");
const route = useRoute();
const queryParams = route.query;
const query = ref(props.initialQuery);
const page = ref(props.initialPage);
const mealTypes = ref(props.initialMealTypes);
const mealDifficulties = ref(props.initialMealDifficulties);
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
    sortField.value = sortKey.value.sort;
  }
}
if (query.value) input.value = query.value;

/**
 * Update the URL to reflect the current state, this is done by using the `queryParametersChanged` emit.
 * This also allows us to recover this state during page reloads.
 */
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
  emits("queryParametersChanged", queryParams);
}

/** A timer to ensure that, when the user is searching, there is not a request send on every key press, but only if the user stops typing for a small amount of time */
let debounceTimeout: NodeJS.Timeout;
watch(input, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    query.value = input.value;
    updateURL();
  }, 500);
});
watch([mealDifficulties, mealTypes, page, sortKey], updateURL, { deep: true });

const layout: Ref<"list" | "grid" | undefined> = ref("list");

const data = await props.getRecipes(
  query,
  page,
  props.pageSize,
  mealDifficulties,
  mealTypes,
  sortField,
  sortOrder,
);
/** The recipes that mach the current search and sort parameters */
const recipes: Ref<(Recipe & { userName: string | undefined; locationArr: [number, number] })[]> = computed(() =>
    data.value.recipes.map((recipe) => {
		recipe.location = [recipe.longitude, recipe.latitude];
		return recipe;
    })
);
const totalAmount = computed(() => data.value.totalAmount);
const meals = Object.values(Meal);
const difficulty = Object.values(Difficulty);

watch(
	totalAmount,
	() =>
		(page.value = Math.max(0, Math.min(
			page.value,
			Math.ceil(totalAmount.value / props.pageSize) - 1,
		))),
);

const dataView = ref(true);
const map = ref(false);

/** Sort the recipes that are returned */
function sort(event: { originalEvent: Event; value: any }) {
  const sortValue = event.value;
  if (sortValue == null) {
    sortOrder.value = 0;
    sortField.value = "";
    sortKey.value = undefined;
  } else {
    sortOrder.value = sortValue.order;
    sortField.value = sortValue.sort;
    sortKey.value = sortValue;
  }
}

// MAP VIEW
const labelMap = "pi pi-map-marker";
const labelList = "pi pi-list";
const iconView = ref(labelMap);
let showList = ref(true);
let showMap = ref(false);

const zoom = ref(3);

function changeView() {
  if (iconView.value == labelMap) {
    iconView.value = labelList;
    showList.value = false;
    showMap.value = true;
  } else {
    iconView.value = labelMap;
    showList.value = true;
    showMap.value = false;
  }
}
</script>

<template>
  <div class="recipesList">
    <div v-show="dataView">
      <DataView :value="recipes" :rows="pageSize" :layout="layout" data-key="1">
        <template #header>
          <div>
            <span class="p-input-icon-left search" v-if="showList">
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
            <Dropdown v-if="showList"
              :model-value="sortKey"
              option-label="label"
              placeholder="Sort by ..."
              :options="sortOptions"
              show-clear
              @change="sort($event)"
            />

            <Button
              :icon="iconView"
              @click="changeView()"
              class="navigatorButton"
            />
			<br />
			{{totalAmount}} recipe{{totalAmount === 1 ? "" : "s"}} found.
          </div>
          <div
            class="MapView"
            style="width: 100px; height: 100%"
            v-if="showMap"
          >
            <div style="height: 90vh; width: 96vw; margin-top: 2rem">
              <LMap ref="map" :zoom="zoom" :center="[50, 50]">
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  layer-type="base"
                  name="OpenStreetMap"
                />

                <div v-for="recipe in recipes">
                  <LMarker :lat-lng="recipe.location">
                    <LPopup>
                      <recipe-card
                        class="popupCard"
                        :show-recipe="recipe"
                        :highlight-matches="highlightMatches"
                        :hide-username="hideUsername"
                      />
                    </LPopup>
                  </LMarker>
                </div>
              </LMap>
            </div>
          </div>
        </template>

        <template #list="{ data: recipe }">
          <recipe-card
            v-if="showList"
            :show-recipe="recipe"
            :highlight-matches="highlightMatches"
            :hide-username="hideUsername"
          />
        </template>
        <template v-if="totalAmount > pageSize" #footer>
          <Paginator
            :first="page * pageSize"
            :always-show-paginator="false"
            :rows="pageSize"
            :total-records="totalAmount"
            @page="($event) => (page = $event.page)"
          />
        </template>
      </DataView>
      <p v-if="totalAmount == 0" class="notFound">No recipes found</p>
    </div>
  </div>
</template>

<style scoped>
.p-grid {
  display: flex;
}

.search,
.p-inputtext {
  width: 100%;
}

.p-multiselect {
  margin: 5px;
  margin-left: 0px;
}

.notFound {
  text-align: center;
  font-size: 1.5rem;
}

.recipesList {
  margin-top: 10px;
  border-radius: 10px;
  border-right: 1px solid var(--surface-100);
  border-left: 1px solid var(--surface-100);
  overflow: hidden;
}

.navigatorButton {
  margin-left: 10px;
  width: 40px;
  height: 42px;
  top: -7px;
}

.popupCard {
  margin-left: 0;
  margin-top: 0;
  margin-left: -6px;
}
</style>
