<template>
    <div>
        <Toolbar class="mt-3">
            <template #start>
                <Image :src="recipy.thumbnail" alt="Thumbnail" height="70" preview />
                <div class="ml-2">
                    <div class="flex flex-wrap justify-content-center align-items-center gap-2 mb-2">
                        <Tag :value="recipy.type"></Tag>
                        <Tag icon="" :value="recipy.difficulty" :severity="getColorDifficulty(recipy.difficulty)"></Tag>
                        <Tag icon="pi pi-clock" :value="recipy.time" :severity="getSeverity(recipy.time)" rounded></Tag>
                    </div>
                    <div
                        v-tooltip.top="
                            (recipy.score ?? 0).toString() +
                            '/5 with ' +
                            recipy.ratings +
                            ' rating' +
                            (recipy.ratings === 1 ? '' : 's')
                        "
                        class="w-fit mt-auto"
                    >
                        <Rating v-model="recipyScore" readonly :cancel="false" class="flex gap-2" />
                    </div>
                </div>
            </template>
            <template #center>
                <div style="text-align: center">
                    <div style="font-size: 2em">{{ recipy.name }}</div>
                    <p class="m-0" style="color: var(--text-color-secondary)">
                        Made by
                        <NuxtLink :to="'/profile/' + recipy.user.id">{{ recipy.user.name }}</NuxtLink>
                    </p>
                </div>
            </template>
            <template #end>
                <Button
                    v-if="user === recipy.user.id"
                    icon="pi pi-file-edit"
                    severity="success"
                    label="Edit recipe"
                    @click="() => navigateTo(`/recipes/${id}/edit`)"
                />
                <Button icon="pi pi-share-alt" class="ml-2" @click="(event) => menu.toggle(event)" />
                <Menu
                    id="overlay_menu"
                    ref="menu"
                    :model="['facebook', 'twitter', 'linkedin', 'email', 'whatsapp']"
                    :popup="true"
                    :pt="{
                        menu: { style: 'width: fit-content; margin: auto;' },
                        root: { style: 'width: fit-content;' },
                    }"
                >
                    <template #item="{ item }">
                        <SocialShare :network="item" :styled="true" :label="false" class="p-2 rounded-none my-1" />
                    </template>
                </Menu>
            </template>
        </Toolbar>

        <TabView @tab-change="invalidateMap">
            <TabPanel header="Recipe">
                <Editor v-model="recipeSteps" editorStyle="height: 320px" readonly />
            </TabPanel>

            <TabPanel header="Ingredients">
                <DataTable :value="ingredients" tableStyle="min-width: 50rem">
                    <Column field="ingredient" header="Ingredient" />
                    <Column field="amount" header="Amount">
                        <template #body="{ data }">
                            <div v-if="data.requestStatus === 'success'">{{ data.amount }}</div>
                            <Skeleton v-else width="3em" height="2em"></Skeleton>
                        </template>
                    </Column>
                    <Column field="unit" header="Unit">
                        <template #body="{ data }">
                            <Dropdown
                                v-if="data.unitType === UnitType.Mass"
                                :options="massUnits"
                                v-model="data.unit"
                                :option-label="(unit) => unitNames[unit]"
                            />
                            <Dropdown
                                v-else-if="data.unitType === UnitType.Volume"
                                :options="volumeUnits"
                                v-model="data.unit"
                                :option-label="(unit) => unitNames[unit]"
                            />
                            <Dropdown v-else v-model="data.unit" :options="[data.unit]" disabled />
                        </template>
                    </Column>
                    <Column field="category" header="Category" />
                </DataTable>
            </TabPanel>

            <TabPanel header="Location">
                <div class="chunk">
                    <div class="map">
                        <div style="height: 80vh; width: 80vw">
                            <LMap ref="map" :zoom="zoom" :center="location">
                                <LTileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    layer-type="base"
                                    name="OpenStreetMap"
                                />
                                <LMarker :lat-lng="location"></LMarker>
                            </LMap>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <!-- TODO: put vertical bar in card and in the right a pin on the map of the recipy -->
            <!-- TODO: fix the layout of this horizontal bar -->
            <TabPanel header="Comments">
                <!-- input text -->
                <Rating v-if="user" v-model="rating" @click="rate" />
                <Textarea v-model="addComment" rows="1" cols="90" />
                <!-- TODO: make this dynamic!!!! -->
                <!--  cancel button -->
                <Button label="Cancel" severity="warning" rounded />
                <!--  comment button -->
                <Button label="Comment" severity="success" @click="comment()" rounded> </Button>

                <div v-for="comment in comments">
                    <Divider align="right" type="solid">
                        <Button :label="comment.user.name" @click="goToProfile(comment.user.id)" severity="info" text />
                    </Divider>

                    <p class="m-0">
                        {{ comment.comment }}
                    </p>

                    <div class="flex gap-5">
                        <div class="flex justify-content-left">
                            <!-- like button -->
                            <Button
                                icon="pi pi-caret-up"
                                :severity="comment.severityLike"
                                @click="like(comment)"
                                rounded
                            />
                            <!-- amount of likes -->

                            <span class="amountStyle">{{ comment.likes }}</span>
                            <!-- dislike button -->

                            <Button
                                icon="pi pi-caret-down"
                                :severity="comment.severityDislike"
                                @click="dislike(comment)"
                                rounded
                            />
                            <!-- answer button -->
                        </div>
                        <div class="flex justify-content-left gap-3">
                            <!--TODO: flex right doesn't work here-->

                            <Textarea v-show="comment.addReaction" v-model="comment.addReactionInput" rows="1" cols="90" />
                            <Button
                                label="Cancel"
                                rounded
                                severity="warning"
                                v-show="comment.addReaction"
                                @click="comment.addReaction = false"
                            />
                            <Button label="Answer" rounded @click="clickOnCommandButton(comment)" />

                            <Button
                                v-if="comment.reactions?.length > 0"
                                label="... reactions"
                                icon="pi pi-angle-down"
                                @click="switchAddReaction(comment)"
                                text
                            />

                            <Button
                                v-if="comment.deleteButton"
                                label="Delete"
                                rounded
                                severity="danger"
                                @click="deleteComment(comment.id, comments, comment.idx)"
                            />
                        </div>
                    </div>

                    <div v-for="reaction in comment.reactions" v-show="comment.showReaction">
                        <Divider align="left gap-3" type="solid">
                            <b>{{ reaction.user.name }}</b
                            >: {{ reaction.comment }}
                            <!-- like button -->
                            <Button
                                icon="pi pi-caret-up"
                                :severity="reaction.severityLike"
                                @click="like(reaction)"
                                rounded
                            />
                            <!-- amount of likes -->

                            <span class="amountStyle">{{ reaction.likes }}</span>
                            <!-- dislike button -->
                            <Button
                                icon="pi pi-caret-down"
                                :severity="reaction.severityDislike"
                                @click="dislike(reaction)"
                                rounded
                            />

                            <Button
                                v-if="reaction.deleteButton"
                                label="Delete"
                                rounded
                                severity="danger"
                                @click="deleteComment(reaction.id, comment.reactions, reaction.idx)"
                            />
                        </Divider>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
const { data } = useAuth();
const user = data.value?.user?.id ?? "";
const route = useRoute();
const id = route.params.id;
const rating = user ? ref((await useFetch(`/api/recipes/${id}/rating`, { query: { user } })).data) : ref();
if (!rating.value) rating.value = 0;
const loggedInUser = data.value?.user?.id;
const loggedInUserName = data.value?.user?.name;
const toast = useToast();

const recipy = (await useFetch(`/api/recipes/${id}`)).data.value;
if (!recipy)
    showError({
        statusCode: 404,
        message: "This recipe does not exist.",
    });
const zoom = ref(6);
const menu = ref();

const location = [recipy.longitude, recipy.lattitude];

const map = ref();
function invalidateMap() {
    // This is done because, if you change the size of your window when the map is not displayed, it doesn't update
    // This solves this by invalidating the size as soon as you change tabs, because when you change tabs, the map is no longer displayed
    if (map) setTimeout(() => map.value.leafletObject.invalidateSize(), 1);
}

// TODO: when putting comments use number for likes instead of strings -> for sorting

const recipyScore = ref(Number(recipy.score));

async function rate() {
    const { status, error } = rating.value
        ? await useFetch(`/api/recipes/${id}/rate`, { method: "POST", body: rating.value })
        : await useFetch(`/api/recipes/${id}/rate`, { method: "DELETE" });
    if (status.value === "success") {
        toast.add({ severity: "success", detail: "Successfully rated", life: 3000 });
        const recipy = (await useFetch(`/api/recipes/${id}`)).data.value;
        recipyScore.value = Number(recipy.score);
    } else
        toast.add({
            severity: "error",
            summary: error.value?.statusCode?.toString() ?? "",
            detail: error.value?.message ?? "",
            life: 3000,
        });
}

const comments = ref(recipy.comments);

function goToProfile(userID) {
    navigateTo(`/profile/${userID}`);
}

async function like(comment) {
    let amount = 1;
    let commentPost = {
        LikeAmount: 0,
        userThatLiked: loggedInUser,
        dislike: false,
        changeLike: false,
        cancel: false,
    };

    if (comment.severityLike == "success") {
        //cancel the like
        amount = -1;
        commentPost.cancel = true;
    }
    if (comment.severityDislike == "danger") {
        //change from dislike to like
        amount = 2;
        comment.severityDislike = "";
        commentPost.changeLike = true;
    }
    let idOfComment = comment.id;
    let newLikeAmount = Number(comment.likes) + amount;
    comment.likes = Number(comment.likes) + amount;
    comment.severityLike = "success";

    if (amount == -1) {
        comment.severityLike = "";
    }

    commentPost.LikeAmount = newLikeAmount;

    await $fetch(`/api/comments/${idOfComment}`, {
        method: "put",
        body: commentPost,
    });
}

async function clickOnCommandButton(comment) {
    if (comment.addReaction) {
        // post a reaction
        let commentData = {
            comment: comment.addReactionInput,
            replied: comment.id,
            user: loggedInUser,
            likes: "0",
            recipe: id,
        };

        await $fetch("/api/comments", {
            method: "post",
            body: commentData,
        });

        comment.showReaction = true;
        let reaction = {
            comment: commentData.comment,
            user: { name: loggedInUserName },
            likes: "0",
        };
        comment.reactions.unshift(reaction);

        // clear input balk
        comment.addReactionInput = "";

        // hide balck
        comment.addReaction = false;
    } else {
        comment.addReaction = true;
    }
}

async function dislike(comment) {
    let amount = -1;
    let commentPost = {
        LikeAmount: 0,
        userThatLiked: loggedInUser,
        dislike: true,
        changeLike: false,
        cancel: false,
    };

    if (comment.severityDislike == "danger") {
        //cancel the dislike
        amount = 1;
        comment.severityDislike = "";
        commentPost.cancel = true;
    }

    if (comment.severityLike == "success") {
        //from like to dislike
        amount = -2;
        comment.severityLike = "";
        commentPost.changeLike = true;
    }

    let idOfComment = comment.id;
    let newLikeAmount = Number(comment.likes) + amount;
    comment.likes = Number(comment.likes) + amount;
    comment.severityDislike = "danger";

    if (amount == 1) {
        comment.severityDislike = "";
    }

    commentPost.LikeAmount = newLikeAmount;

    await $fetch(`/api/comments/${idOfComment}`, {
        method: "put",
        body: commentPost,
    });
}

async function deleteComment(commentID, vect, idx) {
    const data = await $fetch(`/api/comments/${commentID}`, {
        method: "delete",
    });

    console.log(data);

    vect.splice(idx, 1);
}

async function setupReaction() {
    // TODO: get the comments from most to least likes
    // example on how to do this in recipes.[id].index.get.ts

    let userLikes = await $fetch(`/api/users/${loggedInUser}/liked`, {
        method: "get",
    });

    comments.value.map(async (comment, index) => {
        comment.showReaction = false;
        comment.addReaction = false;
        comment.idx = index;
        comment.severityLike = "Primary";
        comment.logedInUser = loggedInUser;

        if (comment.user.id == comment.logedInUser) {
            comment.deleteButton = true;
        }

        let idexToDelete = undefined;

        userLikes.map((element, index) => {
            if (element.comment == comment.id) {
                if (element.dislike == 1) {
                    comment.severityDislike = "danger";
                } else if (element.dislike == 0) {
                    comment.severityLike = "success";
                }
                idexToDelete = index;
            }
        });

        if (idexToDelete != undefined) {
            delete userLikes[idexToDelete];
        }

        let reactions = await $fetch(`/api/comments/${comment.id}`);

        reactions.replies.map((comment, index) => {
            if (comment.userId == loggedInUser) {
                comment.deleteButton = true;
            }
            comment.idx = index;

            userLikes.map((element, index) => {
                if (element.comment == comment.id) {
                    if (element.dislike == 1) {
                        comment.severityDislike = "danger";
                    } else if (element.dislike == 0) {
                        comment.severityLike = "success";
                    }
                    idexToDelete = index;
                }
            });

            if (idexToDelete != undefined) {
                delete userLikes[idexToDelete];
            }
        });

        //test
        comment.reactions = reactions.replies;
    });
}

setupReaction();

const recipyName = recipy.name;
const recipeSteps = ref(recipy.recipe);
const ingredients = await Promise.all(
    recipy.ingredients.map(async (ingredient) => {
        ingredient.unitType = getUnitType(ingredient.unit);
        if (ingredient.unitType === UnitType.Custom) {
            ingredient.requestStatus = "success";
            return ingredient;
        }
        const initialUnit = ingredient.unit;
        const initialAmount = ingredient.amount;
        // This ref is used here to avoid unwrapping of references
        const unit = ref(ingredient.unit);
        ingredient.unit = unit;

        const { data, status } = await useFetch("/api/units", {
            method: "get",
            query: { fromUnit: initialUnit, toUnit: unit, quantity: initialAmount },
            key: initialUnit + unit + initialAmount,
        });
        ingredient.requestStatus = status;
        ingredient.amount = data;
        const columns = [
            { field: "ingredient", header: "Ingredient" },
            { field: "amount", header: "Amount" },
            { field: "type", header: "Type" },
            { field: "category", header: "Category" },
        ];

        return ingredient;
    })
);

const massUnits = [...Object.values(MassUnit)];
const volumeUnits = [...Object.values(VolumeUnit)];

function switchAddReaction(comment) {
    if (comment.showReaction) {
        comment.showReaction = false;
    } else {
        comment.showReaction = true;
    }
}

function getSeverity(time) {
    if (time < 30) {
        return "success";
    } else if (time < 60) {
        return "warning";
    } else {
        return "danger";
    }
}

function getColorDifficulty(difficulty) {
    if (difficulty === "Easy") {
        return "success";
    } else if (difficulty === "Medium") {
        return "warning";
    } else {
        return "danger";
    }
}

const addComment = ref();

async function comment() {
    let comment = addComment.value;

    let commentData = {
        comment: comment,
        commentAnswer: "",
        user: loggedInUser,
        likes: "0",
        recipe: id,
    };

    const { postComment } = await $fetch("/api/comments", {
        method: "post",
        body: commentData,
    });

    const user = await $fetch(`/api/users/${commentData.user}`);
    commentData.user = user.name;
    comments.value.unshift(commentData);

    //TODO: clear the input bar
}

//const recipyName
</script>

<style scoped>
.chunk {
    display: flex;
    align-items: center;
    justify-content: center;
}

.image {
    width: 80vw;
}

.map {
    padding: 1rem;
}

.InfoCard {
    width: 90vw;
    margin: auto;
}

.imageCard {
    width: 10%;
}

.amountStyle {
    font-size: 35px;
}

:deep(.p-editor-toolbar) {
    display: none;
}

:deep(.p-editor-content) {
    border: 1px solid var(--surface-border) !important;
    border-radius: var(--border-radius);
    overflow: hidden;
}

a {
    color: inherit;
    text-decoration: inherit;
}

:deep(.p-toolbar-group-center) {
    flex: 1 1;
    min-width: 25em;
}
:deep(.p-toolbar-group-center > div) {
    margin: 0px auto;
}

@media screen and (max-width: 785px) {
    :deep(.p-toolbar-group-center) {
        flex: 0 0 100%;
        order: -1;
        width: 100%;
        min-width: 0px;
    }

    :deep(.p-toolbar-group-center > div) {
        margin: 0px auto;
    }
}
</style>
