<script setup lang="ts">
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { Meal, Difficulty } from "~/composables/recipes";
import {
  LMap,LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import { Recipe } from "~/database/recipe";

/**
 * Make an array of `locationQuery` out of a variable that is either a singleton, an array or undefined.
 * If `array` is undefined, this returns the empty array, if `array` is a singleton, this returns an array with only that element inside of it, otherwise it just returns the array itself.
 *
 * @param array - The `locationQuery`
 * @returns An array of all `locationquerie`s inside of `array`
 */
function getParamArray(array: LocationQueryValue | LocationQueryValue[] | undefined): LocationQueryValue[] {
    if (!array) return [];
    else if (Array.isArray(array)) return array;
    else return [array];
}

const route = useRoute();
const queryParams = route.query;
const query = (queryParams.query?.valueOf() as string) || "";
const page = parseInt(queryParams.page?.valueOf() as string) || 0;
const mealTypes = getParamArray(queryParams.type) as Meal[];
const mealDifficulties = getParamArray(queryParams.difficulty) as Difficulty[];

/** Change the URL to reflect the state of the `recipesList` */
function updateQueryParams(queryParams: LocationQuery) {
    navigateTo({ path: route.path, query: queryParams, replace: true });
}

/** Get all the recipes that match the current search terms */
function getRecipes(
    query: Ref<string>,
    page: Ref<number>,
    size: number,
    difficulty: Ref<Difficulty[]>,
    mealType: Ref<Meal[]>,
    sortOn: Ref<string>,
    sortOrder: Ref<number>
): Ref<{ recipes: (Recipe & { userName: string | undefined })[]; totalAmount: number }> {
    const { data } = useFetch("/api/recipes", {
        query: {
            query,
            page,
            size,
            difficulty,
            mealType,
            sortOn,
            sort: sortOrder,
            highStart: "<b>",
            highEnd: "</b>",
        },
    });
    return computed(() => {
        return (
            {
                recipes: (data.value?.valueOf() as (Recipe & { userName: string; totalAmount: number })[]) || [],
                totalAmount: ((data.value?.valueOf() || []) as (Recipe & { totalAmount: number })[])[0]?.totalAmount || 0,
            } ?? { recipes: [], totalAmount: 0 }
        );
    });
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


//Leaflet map components 
const zoom = ref(6);
//const marker = ref(latLng(51,-0.99));
</script>
<template>
    <div class="card flex justify-content-left">
      <Button v-show="viewButton" label="View on map" icon="pi pi-compass" @click="viewOnMap()" />
    </div>

    <div v-if="map" style="height: 80vh; width: 50vw">

      <LMap ref="map" :zoom="zoom" :center="[47.21322, -1.559482]" >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          layer-type="base"
          name="OpenStreetMap"
        />
      <LMarker :lat-lng="[50, 50]"></LMarker>
      </LMap>
    </div>

    <recipes-list
        :get-recipes="getRecipes"
        :highlight-matches="true"
        :initial-query="query"
        :initial-page="page"
        :initial-meal-types="mealTypes"
        :initial-meal-difficulties="mealDifficulties"
        @query-parameters-changed="updateQueryParams"
    />
</template>
