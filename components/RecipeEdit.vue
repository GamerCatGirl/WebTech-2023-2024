<template>
    <div class="card">
        <Toolbar>
            <template #start>
                <div>
                    <span class="p-float-label">
                        <InputText
                            id="name"
                            v-model="name"
                            v-bind="nameAttrs"
                            name="name"
                            :class="{ 'p-invalid': errors.name }"
                        />
                        <label for="name">Recipe name</label>
                    </span>
                    <small id="text-error" class="p-error">{{ errors.name || "&nbsp;" }}</small>
                </div>
            </template>
            <template #end>
                <Button label="Save" icon="pi pi-check" class="mr-2" @click="() => save()" />
                <Button
                    v-if="editRecipe"
                    label="Show recipe"
                    severity="success"
                    class="mr-2"
                    @click="() => navigateTo(`/recipes/${editRecipe?.id}`)"
                />
                <Button
                    v-if="editRecipe"
                    label="Delete recipe"
                    icon="pi pi-trash"
                    severity="danger"
                    class="mr-2"
                    @click="deleteRecipe"
                />
                <!-- TODO: Warn user when leaving the page before saving -->
            </template>
        </Toolbar>
    </div>

    <TabView :active-index="tabIndex" @update:active-index="(index: number) => (tabIndex = index)">
        <TabPanel header="Recipe">
            <div style="--tab-index: 0">
                <Editor v-model="recipe" v-bind="recipeAttrs" editor-style="height: 320px" name="recipe" />
                <small id="text-error" class="p-error">{{ errors.recipe }}</small>
            </div>
        </TabPanel>

        <TabPanel header="Info">
            <div class="infoPanel" style="--tab-index: 1">
                <div class="description">
                    <span class="p-float-label">
                        <Textarea
                            id="description"
                            v-model="description"
                            v-bind="descriptionAttrs"
                            name="description"
                            auto-resize
                            :rows="5"
                            :class="{ 'p-invalid': errors.description }"
                        />
                        <label for="description">Description</label>
                    </span>
                    <small id="text-error" class="p-error">{{ errors.description || "&nbsp;" }}</small>
                </div>
                <div>
                    <div class="timeDiv" name="time">
                        <span class="p-float-label">
                            <InputNumber
                                v-model="hours"
                                v-bind="timeAttrs"
                                class="time"
                                name="hours"
                                mode="decimal"
                                show-buttons
                                :min="0"
                                :class="{ 'p-invalid': errors.time }"
                            />
                            <label for="hours">Hours</label>
                        </span>
                        <span class="p-float-label minutes">
                            <InputNumber
                                v-model="minutes"
                                v-bind="timeAttrs"
                                class="time"
                                name="minutes"
                                mode="decimal"
                                show-buttons
                                :min="0"
                                :max="59"
                                :class="{ 'p-invalid': errors.time }"
                            />
                            <label for="minutes">minutes</label>
                        </span>
                    </div>
                    <small id="text-error" class="p-error">{{ errors.time }}</small>
                </div>

                <div>
                    <span class="p-float-label">
                        <Dropdown
                            v-model="mealType"
                            v-bind="mealTypeAttrs"
                            display="chip"
                            class="md:w-14rem"
                            name="type"
                            :options="meals"
                            :max-selected-labels="3"
                            :class="{ 'p-invalid': errors.type }"
                        />
                        <label for="mealType">Type of meal</label>
                    </span>
                    <small id="text-error" class="p-error">{{ errors.type }}</small>
                </div>

                <!-- Difficulty Recipy  -->
                <div>
                    <span class="p-float-label">
                        <Dropdown
                            v-model="difficulty"
                            v-bind="difficultyAttrs"
                            class="md:w-14rem"
                            name="difficulty"
                            :options="difficulties"
                            :max-selected-labels="3"
                            :class="{ 'p-invalid': errors.difficulty }"
                        />
                        <label for="difficulty">Difficulty</label>
                    </span>
                    <small id="text-error" class="p-error">{{ errors.difficulty }}</small>
                </div>
                <div>
                    <FileUpload
                        mode="basic"
                        url="/api/image"
                        method="post"
                        accept="image/*"
                        choose-label="Upload new file"
                        :max-file-size="1000000"
                        :auto="true"
                        @upload="onUpload"
                    />
                    <br />
                    <Image :src="thumbnail" height="250" preview />
                </div>
            </div>
        </TabPanel>

        <TabPanel header="Ingredients">
            <OrderList
                v-model="ingredients"
                list-style="height:auto"
                style="--tab-index: 2"
                @update:selection="(ingredients) => (selectedIngredients = ingredients)"
            >
                <template #header>
                    <p>Ingredients</p>
                    <div>
                        <Button
                            icon="pi pi-plus"
                            label="Add ingredient"
                            class="mr-2"
                            @click="() => ingredients.push(getEmptyIngredient())"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            label="Delete ingredient"
                            @click="
                                () =>
                                    (ingredients = ingredients.filter(
                                        (ingredient) => !(selectedIngredients ?? []).includes(ingredient)
                                    ))
                            "
                        />
                        <!-- @click="deleteRowIngredients(input.Counter, toast)" -->
                    </div>
                </template>
                <template #item="{ item }">
                    <div>
                        <div>
                            <span class="p-float-label">
                                <InputText
                                    v-model="item.ingredient.value"
                                    aria-labelledby="ingredient name"
                                    name="name"
                                    :class="{ 'p-invalid': item.errors.ingredient }"
                                    v-bind="item.ingredient.attributes"
                                />
                                <label for="name">Recipe name</label>
                            </span>
                            <!--     <InputText id="name" v-model="name" v-bind="nameAttrs" :class="{ 'p-invalid': errors.name }" /> -->
                            <small class="p-error">{{ item.errors.ingredient || "&nbsp;" }}</small>
                        </div>
                        <div>
                            <span class="p-float-label">
                                <InputNumber
                                    v-model="item.amount.value"
                                    name="amount"
                                    v-bind="item.amount.attributes"
                                    show-buttons
                                    :max-fraction-digits="2"
                                    :min="0"
                                    :class="{ 'p-invalid': item.errors.amount }"
                                />
                                <label for="amount">Amount</label>
                            </span>
                            <small class="p-error">{{ item.errors.amount || "&nbsp;" }}</small>
                        </div>
                        <div>
                            <span class="p-float-label">
                                <Dropdown
                                    v-model="item.unit.value"
                                    v-bind="item.unit.attributes"
                                    :class="{ 'p-invalid': item.errors.unit }"
                                    :options="units"
                                    option-group-label="label"
                                    option-group-children="items"
                                    editable
                                    class="w-full md:w-14rem"
                                    name="unit"
                                >
                                    <template #optiongroup="{ option }">
                                        <div :alt="option.label" :class="`pi pi-${option.icon}`">
                                            &VeryThinSpace;{{ option.label }}
                                        </div>
                                    </template>
                                </Dropdown>
                                <label for="unit">Unit</label>
                            </span>
                            <small class="p-error">{{ item.errors.unit || "" }}</small>
                        </div>
                        <div>
                            <span class="p-float-label">
                                <Dropdown
                                    v-model="item.category.value"
                                    v-bind="item.category.attributes"
                                    :class="{ 'p-invalid': item.errors.category }"
                                    :options="ingredientTypes"
                                    class="w-full md:w-14rem"
                                    name="category"
                                />
                                <label for="category">Category</label>
                            </span>
                            <small class="p-error">{{ item.errors.category || "" }}</small>
                        </div>
                    </div>
                </template>
            </OrderList>
        </TabPanel>

        <TabPanel header="Location">
            <!-- TODO: implement buttons -->
            <div class="flex gap-3">
                <Button label="add marker" icon="pi pi-map" />
                <Button label="Reset marker" icon="pi pi-history" @click="getLocation()" />
            </div>
            <!-- <div style="--tab-index: 3"></div> -->
            <div style="height: 80vh; width: 90vw">
                <LMap ref="map" :zoom="zoom" :center="marker">
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        layer-type="base"
                        name="OpenStreetMap"
                    />
                    <LMarker :lat-lng="marker"></LMarker>
                </LMap>
            </div>
        </TabPanel>
    </TabView>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/valibot";
import { configure, useForm } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { Recipe, insertRecipeSchema } from "~/database/recipe";
import { insertIngredientSchema, ingredientsDB } from "~/database/ingredients";
import {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
} from "@vue-leaflet/vue-leaflet";

const zoom = ref(6);
const marker = ref([0, 0]);
//const map = ref();
const meals = Object.values(Meal);
const difficulties = Object.values(Difficulty);
const units = [
    { label: "Mass", items: Object.values(MassUnit).map((unit) => unitNames[unit]) },
    { label: "Volume", items: Object.values(VolumeUnit).map((unit) => unitNames[unit]) },
];
const ingredientTypes = [...Object.values(Ingredient)];
const thumbnail = ref("/placeholder.svg");
const selectedIngredients = ref();
const toast = useToast();

const tabIndex = ref();
const props = defineProps<{
    /** The ID of the recipe you want to edit, if you want to create a new recipe, you should leave this empty */
    editRecipe?: Recipe;
}>();

async function deleteRecipe() {
    if (!props.editRecipe) return;
    const res = confirm("Are you sure you want to delete this recipe?");
    if (res) {
        const result = await useFetch(`/api/recipes/${props.editRecipe.id}`, { method: "delete" });
        if (result.status.value === "success") {
            toast.add({ severity: "success", detail: "Recipe was deleted", life: 3000 });
            await navigateTo("/recipes");
        } else if (result.status.value === "error")
            toast.add({
                severity: "error",
                detail: result.error.value?.data.message,
                life: 3000,
            });
    }
}

configure({
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
});
const { errors, defineField, validate } = useForm({
    validationSchema: toTypedSchema(insertRecipeSchema),
});
const hours = ref(0);
const minutes = ref(0);
const [name, nameAttrs] = defineField("name");
const [recipe, recipeAttrs] = defineField("recipe");
const [description, descriptionAttrs] = defineField("description");
const [time, timeAttrs] = defineField("time");
const [mealType, mealTypeAttrs] = defineField("type");
const [difficulty, difficultyAttrs] = defineField("difficulty");
watch([hours, minutes], () => (time.value = (hours.value ?? 0) * 60 + (minutes.value ?? 0)), { deep: true });

/** Temporary ID used as a data key in the orderlist */
let id = 0;
const ingredients = ref([getEmptyIngredient()]);

if (props.editRecipe) {
    const editRecipe = props.editRecipe;
    name.value = editRecipe.name;
    recipe.value = editRecipe.recipe;
    description.value = editRecipe.description;
    hours.value = Math.floor(editRecipe.time / 60);
    minutes.value = editRecipe.time % 60;
    time.value = editRecipe.time;
    mealType.value = editRecipe.type;
    difficulty.value = editRecipe.difficulty;
    ingredients.value = [];
    for (const ingredient of editRecipe.ingredients as ingredientsDB[]) {
        const newIngredient = getEmptyIngredient();
        newIngredient.ingredient.value.value = ingredient.ingredient;
        // @ts-expect-error
        newIngredient.unit.value.value = unitNames[ingredient.unit] ?? ingredient.unit;
        newIngredient.amount.value.value = ingredient.amount;
        newIngredient.category.value.value = ingredient.category;
        newIngredient.id = ingredient.id;
        newIngredient.defaultID = false;

        ingredients.value.push(newIngredient);
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // TODO: add toast
        // "Geolocation is not supported by this browser.";
    }
}

getLocation();

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

//map.on('click', onMapClick);

function showPosition(position) {
    marker.value = [position.coords.latitude, position.coords.longitude];
}

function getEmptyIngredient() {
    const { errors, defineField, validate } = useForm({
        validationSchema: toTypedSchema(insertIngredientSchema),
    });

    const [ingredient, ingredientAttrs] = defineField("ingredient");
    const [amount, amountAttrs] = defineField("amount");
    const [unit, unitAttrs] = defineField("unit");
    const [category, categoryAttrs] = defineField("category");
    const [index] = defineField("index");
    index.value = 0;

    return {
        errors,
        validate,
        id: (id++).toString(),
        /** Is this an ID that exists inside of the database, or assigned just to differentiate between ingredients inside the UI */
        defaultID: true,
        ingredient: { value: ingredient, attributes: ingredientAttrs },
        amount: { value: amount, attributes: amountAttrs },
        unit: { value: unit, attributes: unitAttrs, unit: "" },
        category: { value: category, attributes: categoryAttrs },
    };
}

async function save() {
    // TODO: add location from var marker.value to database

    let validated = await validate();
    if (validated.valid && ingredients.value.length === 0) {
        toast.add({
            severity: "error",
            detail: "Please add some ingredients to your recipe.",
            life: 3000,
        });
        tabIndex.value = 2;
        return;
    }
    for (const ingredient of ingredients.value) {
        const unit = getUnit(ingredient.unit.value);
        if (unit) ingredient.unit.value = unitNames[unit];

        ingredient.unit.unit = unit ?? ingredient.unit.value;
        const val = await ingredient.validate();
        if (validated.valid) validated = val;
    }

    if (validated.valid) {
        const sendIngredients = ingredients.value.map((ingredient, index) => {
            return {
                id: ingredient.defaultID ? undefined : ingredient.id,
                ingredient: ingredient.ingredient.value,
                amount: ingredient.amount.value,
                unit: ingredient.unit.unit,
                category: ingredient.category.value,
                index,
            };
        });
        const sendRecipe = {
            name: name.value,
            location: "TODO",
            ingredients: sendIngredients,
            description: description.value,
            recipe: recipe.value,
            thumbnail: thumbnail.value,
            time: time.value,
            type: mealType.value,
            difficulty: difficulty.value,
        };

        let res: any;
        if (!props.editRecipe) {
            res = await useFetch("/api/recipes", {
                method: "post",
                body: sendRecipe,
            });
            let id: string;
            if (res.status.value === "success") {
                id = res.data.value;
                await navigateTo(`/recipes/${id}/edit`);
            }
        } else {
            res = await useFetch(`/api/recipes/${props.editRecipe.id}`, {
                method: "post",
                body: sendRecipe,
            });
        }
        if (res.status.value === "error") {
            toast.add({
                severity: "error",
                detail: res.error.value?.data.message,
                life: 3000,
            });
            return;
        }
        toast.add({
            severity: "success",
            detail: "Successfully saved the recipe.",
            life: 3000,
        });
    } else {
        const firstError = Object.keys(validated.errors)[0];
        const el = document.querySelector(`[name="${firstError}"]`);
        const errorTabIndex = el ? parseInt(getComputedStyle(el).getPropertyValue("--tab-index")) : undefined;
        if (errorTabIndex || errorTabIndex === 0) tabIndex.value = errorTabIndex;
        setTimeout(() => {
            el?.scrollIntoView({
                behavior: "smooth",
            });
            el?.focus();
        }, 100);
    }
}

// TODO: you cannot upload multiple mealtypes to database

// let scoreRecipe = 0;
// const inputs = ref([newDummy()]);

const onUpload = (event: any) => {
    thumbnail.value = event.xhr.response;
};
</script>

<style scoped>
:deep(.p-orderlist-header) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

:deep(.p-orderlist-header p) {
    font-size: 1.4em;
    margin: auto 0;
}

:deep(.p-orderlist-item > div) {
    display: flex;
    flex-wrap: wrap;
}

:deep(.p-orderlist-item > div > *) {
    margin: 0 5px;
    margin-top: 1.5em;
}

:deep(.p-orderlist-list .p-float-label) {
    width: fit-content;
}

:deep(.p-orderlist-list *:has(> .p-float-label)) {
    width: fit-content;
}

.infoPanel {
    width: 85%;
    margin: 0 auto;
    margin-top: 1em;
}

.infoPanel > * {
    margin: 2em 0px;
}

.description {
    margin-top: 0.5em;
}

.description textarea {
    width: 100%;
}

.timeDiv {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em;
}

.time {
    width: 6em;
    margin-right: 3em;
}

:deep(.time .p-inputtext) {
    width: 6em;
}

.p-image {
    border: 1px solid grey;
}

.card {
    margin-top: 20px;
}

:deep(.p-orderlist-item .p-ink),
:deep(.p-orderlist-item .p-ink-active) {
    display: none;
}

:deep(.p-orderlist-item > * .p-ink),
:deep(.p-orderlist-item > * .p-ink-active) {
    display: initial;
}
</style>