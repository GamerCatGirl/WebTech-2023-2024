<script setup lang="ts">
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
            query: Ref<String>,
            page: Ref<Number>,
            size: Number,
            difficulty: Ref<Difficulty[]>,
            mealType: Ref<Meal[]>,
            sortOn: Ref<string>,
            sortOrder: Ref<number>
        ) => Ref<{ recipes: Recipe[]; totalAmount: Number }>;
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
        initalPage?: number;
        /** The meals on which to filter */
        initialMealTypes?: Meal[];
        /** the difficulties on which to filter */
        initialMealDifficulties?: Difficulty[];
    }>(),
    {
        highlightMatches: false,
        initialQuery: "",
        pageSize: 20,
        initalPage: 0,
        initialMealTypes: () => [],
        initialMealDifficulties: () => [],
    }
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
];

const input = ref("");
const route = useRoute();
const queryParams = route.query;
const query = ref(props.initialQuery);
const page = ref(props.initalPage);
const mealTypes = ref(props.initialMealTypes);
const mealDifficulties = ref(props.initialMealDifficulties);
const sortKey: Ref<sortOption | undefined> = ref(undefined);
const sortField = ref("");
const sortOrder = ref(1);
if (queryParams.sort && queryParams.sortOrder) {
    sortKey.value = sortOptions.find(({ sort, order }) => {
        return parseInt(queryParams.sortOrder?.valueOf() as string) === order && queryParams.sort?.valueOf() === sort;
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

const data = props.getRecipes(query, page, props.pageSize, mealDifficulties, mealTypes, sortField, sortOrder);
/** The recipes that mach the current search and sort parameters */
const recipes = computed(() => {
    return (
        data.value.recipes.map((value) => {
            const recipe = value;
            const hours = Math.floor((recipe.time ?? 0) / 60);
            const minutes = (recipe.time ?? 0) % 60;
            const cookTime = (hours ? hours + "h" : "") + (minutes ? minutes + "m" : "");
            let name = recipe.name;
            let descList = [recipe.description];
            if (props.highlightMatches) {
                name = recipe.name.replaceAll(/<\/?b>/g, "");
                descList = recipe.description?.split(/<\/?b>/) ?? [];
            }
            const totalAmount = data.value.totalAmount;
            return { ...recipe, name, totalAmount, descList, cookTime };
        }) ?? []
    );
});
const meals = Object.values(Meal);
const difficulty = Object.values(Difficulty);

const dataView = ref(true);
const map = ref(false);
const viewButton = ref(true);

function viewOnMap() {
    dataView.value = false;
    map.value = true;
}

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
            <DataView :value="recipes" :rows="pageSize" :layout="layout" data-key="1">
                <template #header>
                    <div>
                        <span class="p-input-icon-left search">
                            <i class="pi pi-search" />
                            <InputText v-model="input" type="text" placeholder="Search recipes..." />
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
                            <Tag icon="pi pi-clock" :value="recipe.cookTime" severity="info" rounded />
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
                            <NuxtLink :to="'/profile/' + recipe.user">{{ recipe.userName }}</NuxtLink>
                        </template>
                        <template #header>
                            <nuxtLink :to="'/recipes/' + recipe.id">
                                <Image :src="recipe.thumbnail" />
                            </nuxtLink>
                        </template>

                        <template #content>
                            <template v-for="(description, index) in recipe.descList" :key="index">
                                <b v-if="index % 2 == 1">{{ description }}</b>
                                <template v-else>{{ description }}</template>
                            </template>
                        </template>
                        <template #footer>
                            <Rating v-model="recipe.score" readonly :cancel="false" class="flex gap-2" />
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
