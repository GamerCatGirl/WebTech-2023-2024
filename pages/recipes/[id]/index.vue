<template>
  <div>
    <Toolbar class="mt-3 mb-3">
      <template #start>
        <Image :src="recipy.thumbnail" alt="Thumbnail" height="70" preview />
        <div class="ml-2">
          <div
            class="flex flex-wrap justify-content-center align-items-center gap-2 mb-2"
          >
            <Tag :value="recipy.type"></Tag>
            <Tag
              icon=""
              :value="recipy.difficulty"
              :severity="getColorDifficulty(recipy.difficulty)"
            ></Tag>
            <Tag
              icon="pi pi-clock"
              :value="cookTime"
              :severity="getSeverity(recipy.time)"
              rounded
            ></Tag>
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
            <Rating
              v-model="recipyScore"
              readonly
              :cancel="false"
              class="flex gap-2"
            />
          </div>
        </div>
      </template>
      <template #center>
        <div style="text-align: center">
          <div style="font-size: 2em">{{ recipy.name }}</div>
          <p class="m-0 madeInfo">
            Made by
            <NuxtLink :to="'/profile/' + recipy.user.id">{{
              recipy.user.name
            }}</NuxtLink>
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
        <Button
          icon="pi pi-share-alt"
          class="ml-2"
          @click="(event) => menu.toggle(event)"
        />
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
            <SocialShare
              :network="item"
              :styled="true"
              :label="false"
              class="p-2 rounded-none my-1"
            />
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
              <div v-if="data.requestStatus === 'success'">
                {{ data.amount }}
              </div>
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
              <Dropdown
                v-else
                v-model="data.unit"
                :options="[data.unit]"
                disabled
              />
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
      <TabPanel header="Comments">
        <div v-if="user">
          <p class="fts-3 mb-2 text-xl">Rate this recipe:</p>
          <Rating v-model="rating" class="ml-3" @click="rate" />
          <p class="mt-5 mb-2 text-xl">Leave a comment on this recipe:</p>
          <div class="flex">
            <Textarea v-model="addComment" cols="90" auto-resize class="ml-3" />
            <!--  cancel button -->
            <Button
              label="Cancel"
              severity="warning"
              class="commentButton"
              @click="() => (addComment = '')"
            />
            <!--  comment button -->
            <Button
              label="Comment"
              severity="success"
              class="commentButton"
              @click="comment()"
            />
          </div>
        </div>

        <p class="mt-5 mb-2 text-xl">Other comments:</p>
        <p v-if="comments.length === 0" class="mx-auto text-center text-xl">
          There are no comments for this recipe yet.
        </p>

        <div
          v-for="comment in comments"
          style="padding-bottom: 1rem; padding-top: 1rem"
        >
          <Card style="background-color: #ecddfc; padding: 0rem">
            <template #title>
              <Avatar
                v-if="comment.user?.image"
                :image="comment.user?.image ?? ''"
                shape="circle"
                preview
              />
              <Avatar v-else icon="pi pi-user" class="mt-2" shape="circle" />

              <Button
                :label="comment.user.name"
                @click="goToProfile(comment.user.id)"
                style="opacity: 1; color: #553DE6;"
                severity="info"
                text
              />
            </template>

            <template #subtitle>
              <Button
                class="sizeButton"
                icon="pi pi-caret-up"
                :severity="comment.severityLike"
                @click="like(comment)"
                text
                rounded
              />
            </template>

            <template #content>
              <span class="amountStyle" style="color: #553DE6">{{
                comment.likes
              }}</span>
              <span style="color: #553DE6; margin-left: 4rem">
                {{ comment.comment }}
              </span>
            </template>

            <template #footer>
              <div class="flex gap-5" style="margin-bottom: 3rem">
                <div class="flex justify-content-left">
                  <!-- like button -->

                  <Button
                    icon="pi pi-caret-down"
                    :severity="comment.severityDislike"
                    @click="dislike(comment)"
                    text
                    rounded
                  />
                </div>

                <div>
                  <div class="gap-3">
                    <Textarea
                      v-show="comment.addReaction"
                      v-model="comment.addReactionInput"
                      rows="1"
                      style="width: 60vw; margin-bottom: 1rem; margin-right: 1rem;"
                    />
                    <Button
                      label="Cancel"
                      rounded
                      severity="warning"
                      v-show="comment.addReaction"
                      style="margin-bottom: 1rem"
                      @click="comment.addReaction = false"
                    />
                  </div>
                  <div class="flex gap-3">
                    <Button
                      label="Answer"
                      rounded
                      @click="clickOnCommandButton(comment)"
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
              </div>
              <Button
                style="margin-left: 3rem; margin-bottom: 1rem"
                v-if="comment.reactions?.length > 0"
                label="Reactions"
                icon="pi pi-angle-down"
                @click="switchAddReaction(comment)"
                text
                rounded
                outlined
              />
              <div
                v-for="reaction in comment.reactions"
                v-show="comment.showReaction"
                style="margin-bottom: 1rem"
              >
                <Card>
                  <template #content>
                    <Button text style="top: 11px"
                      >{{ reaction.user.name }} :</Button
                    >
                    {{ reaction.comment }}
                    <!-- like button -->
                    <Button
                      style="top: 10px; margin-left: 2rem"
                      icon="pi pi-caret-up"
                      :severity="reaction.severityLike"
                      @click="like(reaction)"
                      rounded
                      text
                    />
                    <!-- amount of likes -->

                    <span style="font-size: 20px">{{ reaction.likes }}</span>
                    <!-- dislike button -->
                    <Button
                      style="top: 10px"
                      icon="pi pi-caret-down"
                      :severity="reaction.severityDislike"
                      @click="dislike(reaction)"
                      text
                      rounded
                    />

                    <Button
                      style="margin-left: 2rem"
                      v-if="reaction.deleteButton"
                      label="Delete"
                      rounded
                      severity="danger"
                      @click="
                        deleteComment(
                          reaction.id,
                          comment.reactions,
                          reaction.idx,
                        )
                      "
                    />
                  </template>
                </Card>
              </div>
            </template>
          </Card>
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
const rating = user
  ? ref((await useFetch(`/api/recipes/${id}/rating`, { query: { user } })).data)
  : ref();
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
const hours = Math.floor((recipy.time ?? 0) / 60);
const minutes = (recipy.time ?? 0) % 60;
const cookTime = (hours ? hours + "h" : "") + (minutes ? minutes + "m" : "");

const location = [recipy.longitude, recipy.latitude];

const map = ref();
function invalidateMap() {
  // This is done because, if you change the size of your window when the map is not displayed, it doesn't update
  // This solves this by invalidating the size as soon as you change tabs, because when you change tabs, the map is no longer displayed
  if (map) setTimeout(() => map.value.leafletObject.invalidateSize(), 1);
}

const recipyScore = ref(Number(recipy.score));

async function rate() {
  const { status, error } = rating.value
    ? await useFetch(`/api/recipes/${id}/rate`, {
        method: "POST",
        body: rating.value,
      })
    : await useFetch(`/api/recipes/${id}/rate`, { method: "DELETE" });
  if (status.value === "success") {
    toast.add({
      severity: "success",
      detail: "Successfully rated",
      life: 3000,
    });
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

  vect.splice(idx, 1);
}

async function setupReaction() {

  let userLikes = await $fetch(`/api/users/${loggedInUser}/liked`);

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

    reactions.replies.map((reaction, index) => {
      if (reaction.userId == loggedInUser) {
        reaction.deleteButton = true;
      }
      reaction.idx = index;

      userLikes.map((element, index) => {
        if (element.comment == reaction.id) {
          if (element.dislike == 1) {
            reaction.severityDislike = "danger";
          } else if (element.dislike == 0) {
            reaction.severityLike = "success";
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
  }),
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
  const comment = addComment.value;
  if (!comment || comment.length < 10) {
    toast.add({
      severity: "error",
      life: 3000,
      detail: "Please add some content to your comment.",
    });
    return;
  }

  let commentData = {
    comment,
    commentAnswer: "",
    user: loggedInUser,
    likes: 0,
    recipe: id,
  };

  const { postComment } = await $fetch("/api/comments", {
    method: "post",
    body: commentData,
  });

  const user = await $fetch(`/api/users/${commentData.user}`);
  commentData.user = user;
  comments.value.unshift(commentData);

  addComment.value = "";
}
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
  min-width: 20em;
}

:deep(.p-toolbar-group-center > div) {
  margin: 0px auto;
}

.commentButton {
  margin-bottom: auto;
  margin-left: 0.5em;
  flex-shrink: 0;
}

:deep(.reactionButton),
:deep(.voteButton) {
  font-size: 0.7rem;
  padding: 0.5rem;
  margin-bottom: auto;
}

.voteButton.p-button {
  width: 1.5rem;
  font-size: 0.5rem;
  padding: 0.3rem;
  margin-bottom: auto;
}

.madeInfo {
  color: var(--text-color-secondary);
}

.commentUserLink {
  color: var(--text-color-primary);
}

@media screen and (max-width: 888px) {
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
