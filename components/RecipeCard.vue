<script setup lang="ts">
import { Recipe } from "~/database/recipe";
import { Difficulty } from "~/composables/recipes";
const props = defineProps<{
    /** The recipe to display */
    showRecipe: Recipe & { userName: string | undefined };
    /**
     * Whether or not to highlight the matches that match the `query` parameter given to `getRecipes`.
     *
     * If this is set to `true`, the returned recipes should have a description where the matches are surrounded by `b` tags.
     * If you are using `/api/recipes` as the api, you can set `highStart` to `<b>` and `highEnd` to `</b>` when sending the request, this will surround your matches with `b` tags automatically.
     */
    highlightMatches: boolean;
}>();

const visualRecipe = computed(() => {
    const recipe = props.showRecipe;
    const hours = Math.floor((recipe.time ?? 0) / 60);
    const minutes = (recipe.time ?? 0) % 60;
    const cookTime = (hours ? hours + "h" : "") + (minutes ? minutes + "m" : "");
    let name = recipe.name;
    let descList = [recipe.description];
    if (props.highlightMatches) {
        name = recipe.name.replaceAll(/<\/?b>/g, "");
        descList = recipe.description?.split(/<\/?b>/) ?? [];
    }
    return { ...recipe, name, descList, cookTime };
});
</script>

<template>
    <Card>
        <template #title>
            <nuxtLink :to="'/recipes/' + visualRecipe.id"> {{ visualRecipe.name }} </nuxtLink>
            <br />
            <Tag icon="pi pi-clock" :value="visualRecipe.cookTime" severity="info" rounded />
            <Tag
                icon=""
                :value="visualRecipe.difficulty"
                :severity="
                    visualRecipe.difficulty == Difficulty.Easy
                        ? 'success'
                        : visualRecipe.difficulty == Difficulty.Medium
                          ? 'warning'
                          : 'danger'
                "
            />
            <Tag :value="visualRecipe.type" />
        </template>
        <template v-if="visualRecipe.userName" #subtitle>
            Made by
            <NuxtLink :to="'/profile/' + visualRecipe.user">{{ visualRecipe.userName }}</NuxtLink>
        </template>
        <template #header>
            <nuxtLink :to="'/recipes/' + visualRecipe.id">
                <Image :src="visualRecipe.thumbnail" />
            </nuxtLink>
        </template>

        <template #content>
            <template v-if="highlightMatches">
                <template v-for="(description, index) in visualRecipe.descList" :key="index">
                    <b v-if="index % 2 == 1">{{ description }}</b>
                    <template v-else>{{ description }}</template>
                </template>
            </template>
            <p v-else>{{ visualRecipe.description }}</p>
        </template>
        <template #footer>
            <Rating :model-value="visualRecipe.score ?? 0" readonly :cancel="false" class="flex gap-2" />
        </template>
    </Card>
</template>

<style scoped>
.p-card {
    width: 20em;
    max-width: 30em;
    margin: 10px;
    flex-grow: 1;
}

.p-card-header .p-image {
    display: inline-block;
    width: 100%;
}

:deep(.p-card-content) {
    max-height: 20em;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 15;
    overflow: hidden;
}

:deep(.p-card-title) {
    text-overflow: ellipsis;
    overflow: hidden;
}

.p-card-title .p-tag {
    margin-right: 2px;
}

:deep(.p-card-header .p-image img) {
    object-fit: contain;
    width: 100%;
    max-height: 23em;
    border-radius: var(--border-radius) var(--border-radius) 0px 0px;
}

a {
    color: inherit;
    text-decoration: inherit;
}
</style>
