<script setup lang="ts">
import { LocationQuery, LocationQueryValue } from "vue-router";
import { Recipe } from "~/database/recipe";
import { Meal, Difficulty } from "~/composables/recipes";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const { data } = useAuth();
const authenticatedUser = data.value?.user?.id ?? "";

const route = useRoute();
const id = route.params.id;
const { data: user } = await useFetch(`/api/users/${id}`);
if (!user)
  showError({
    statusCode: 404,
    message: "This user does not exist.",
  });

async function getUserRecipes(
  query: Ref<string>,
  page: Ref<number>,
  size: number,
  difficulty: Ref<Difficulty[]>,
  mealType: Ref<Meal[]>,
  sortOn: Ref<string>,
  sortOrder: Ref<number>,
): Promise<
  Ref<{
    recipes: (Recipe & { userName: string | undefined })[];
    totalAmount: number;
  }>
> {
  const { data } = await useFetch("/api/recipes", {
    query: {
      query,
      page,
      size,
      difficulty,
      mealType,
      sortOn,
      user: id,
      sort: sortOrder,
      highStart: "<b>",
      highEnd: "</b>",
    },
    // A key is necessary here, because otherwise nuxt sends the request both on server-side and on client-side, resulting in a hydration mismatch
    key: "recipes",
  });
  return computed(() => {
    return (
      {
        recipes:
          (
            data.value?.valueOf() as {
              recipes: (Recipe & { userName: string })[];
              totalAmount: number;
            }
          )?.recipes || [],
        totalAmount:
          (data.value?.valueOf() as { recipes: Recipe; totalAmount: number })
            ?.totalAmount || 0,
      } ?? { recipes: [], totalAmount: 0 }
    );
  });
}

/**
 * Make an array of `locationQuery` out of a variable that is either a singleton, an array or undefined.
 * If `array` is undefined, this returns the empty array, if `array` is a singleton, this returns an array with only that element inside of it, otherwise it just returns the array itself.
 *
 * @param array - The `locationQuery`
 * @returns An array of all `locationquerie`s inside of `array`
 */
function getParamArray(
  array: LocationQueryValue | LocationQueryValue[] | undefined,
): LocationQueryValue[] {
  if (!array) return [];
  else if (Array.isArray(array)) return array;
  else return [array];
}

const queryParams = route.query;
const query = (queryParams.query?.valueOf() as string) || "";
const page = parseInt(queryParams.page?.valueOf() as string) || 0;
const mealTypes = getParamArray(queryParams.type) as Meal[];
const mealDifficulties = getParamArray(queryParams.difficulty) as Difficulty[];

/** Change the URL to reflect the state of the `recipesList` */
function updateQueryParams(queryParams: LocationQuery) {
  navigateTo({ path: route.path, query: queryParams, replace: true });
}

const confirmDeleteKeys = useConfirm();
const toast = useToast();
function confirmDelete() {
  confirmDeleteKeys.require({
    message:
      "Are you sure you want to delete all your API keys, this cannot be undone?",
    header: "Deleting all your API keys",
    icon: "pi pi-exclamation-triangle",
    accept: async () => {
      const { status, error } = await useFetch("/api/key", {
        method: "DELETE",
      });
      if (status.value === "success")
        toast.add({
          severity: "success",
          detail: "Successfully removed all your API keys.",
          life: 3000,
        });
      else if (status.value === "error")
        toast.add({
          severity: "error",
          summary:
            error.value?.statusCode?.toString() ??
            "" + error.value?.statusMessage ??
            "",
          detail: error.value?.message ?? "",
          life: 3000,
        });
    },
  });
}

const apiKeysVisible = ref(false);
const apiKey = ref("");
watch(apiKeysVisible, () => (apiKey.value = ""));

const followingVisible = ref(false);
const followersVisible = ref(false);
const searchFollowers = ref();

const { data: amountRecipes } = await useFetch(`/api/users/${id}/recipes`, {query: {amount: true}});

const followData = await useFetch(`/api/followers/${user?.value.id}`);

const followersID = followData.data.value.followers;
const followingID = followData.data.value.following;
const amountFollowing = ref(followingID.length);
const amountFollowers = ref(followersID.length);

const followersData = followersID;
const severityFollowButton = ref("success");
const iconFollowButton = ref("pi pi-user-plus");
const labelFollowButton = ref("Follow");

followersID.map(async (follower, index) => {
  let idFollower = follower.idFollower;
  let user = await useFetch(`/api/users/${idFollower}`);
  if (idFollower === authenticatedUser) {
    severityFollowButton.value = "danger";
    iconFollowButton.value = "pi pi-user-minus";
    labelFollowButton.value = "Unfollow";
  }
  followersData[index] = user.data.value;

});

const followingData = followingID;

followingID.map(async (follower, index) => {
  let idFollower = follower.idFollowing;
  let user = await useFetch(`/api/users/${idFollower}`);
  followingData[index] = user.data.value;
});


function showFollowers() {
  followersVisible.value = !followersVisible.value;
}

function showFollowing() {
  followingVisible.value = !followingVisible.value;
}


async function unfollow(userID) {
  await useFetch(`/api/followers`, {
    method: "delete",
    body: {
      idFollower: authenticatedUser,
      idFollowing: userID,
    },
  });

  location.reload();
}

async function changeFollow() {
  let post = {
    idFollower: authenticatedUser,
    idFollowing: user?.value.id,
  };

  if (severityFollowButton.value == "success") {
    await useFetch(`/api/followers`, {
      method: "post",
      body: post,
    });

    severityFollowButton.value = "danger";
    iconFollowButton.value = "pi pi-user-minus";
    labelFollowButton.value = "Unfollow";

    amountFollowers.value += 1;
  } else {
    severityFollowButton.value = "success";
    iconFollowButton.value = "pi pi-user-plus";
    labelFollowButton.value = "Follow";
    amountFollowers.value -= 1;

    await useFetch(`/api/followers`, {
      method: "delete",
      body: post,
    });
  }

}
</script>

<template>
  <div class="profile">
    <div class="profileDiv">
      <div>
        <div class="profileInfo">
          <Avatar
            v-if="user?.image"
            :image="user?.image ?? ''"
            shape="circle"
            preview
          />
          <Avatar v-else icon="pi pi-user" class="mt-2" shape="circle" />
          <h1>{{ user?.name }}</h1>
        </div>
        <br />

        <div class="chunk">
          <div class="infoStatic">
		  <b> {{ amountRecipes }} </b> recipe{{amountRecipes === 1 ? "" : "s"}}
          </div>
          <div class="info" @click="showFollowers()">
            <b> {{ amountFollowers }} </b> followers
          </div>
          <div class="info" @click="showFollowing()">
            <b> {{ amountFollowing }} </b> following
          </div>

          <Dialog
            v-model:visible="followersVisible"
            modal
            header="Followers"
            class="popupWindow"
          >
            <span class="p-input-icon-left search">
              <i class="pi pi-search" />
              <InputText
                v-model="searchFollowers"
                type="text"
                placeholder="Search followers..."
              />
            </span>

            <div v-for="follower in followersData">
              <div class="chunk">
                <div class="profileInfoSmall">
                  <Avatar
                    v-if="follower?.image"
                    :image="follower?.image ?? ''"
                    shape="circle"
                    preview
                  />
                  <Avatar
                    v-else
                    icon="pi pi-user"
                    class="mt-2"
                    shape="circle"
                  />
                  <p style="font-size: 20px; margin-top: 6px; margin-left: 5px">
                    {{ follower?.name }}
                  </p>
                  <Button
                    v-if="authenticatedUser === user?.id"
                    label="Delete"
                  />
                </div>

              </div>
            </div>
          </Dialog>

          <Dialog
            v-model:visible="followingVisible"
            modal
            header="Following"
            class="popupWindow"
          >
            <span class="p-input-icon-left search">
              <i class="pi pi-search" />
              <InputText
                v-model="searchFollowers"
                type="text"
                placeholder="Search following..."
              />
            </span>

            <div v-for="follower in followingData">
              <div class="chunk">
                <div class="profileInfoSmall">
                  <Avatar
                    v-if="follower?.image"
                    :image="follower?.image ?? ''"
                    shape="circle"
                    preview
                  />
                  <Avatar
                    v-else
                    icon="pi pi-user"
                    class="mt-2"
                    shape="circle"
                  />
                  <p style="font-size: 20px; margin-top: 6px; margin-left: 5px">
                    {{ follower?.name }}
                  </p>
                  <Button
                    v-if="authenticatedUser === user?.id"
                    @click="unfollow(follower?.id)"
                    class="buttonPopup"
                    label="Unfollow"
                  />
                </div>

              </div>
            </div>
          </Dialog>
        </div>
        These are {{ user?.name }}'s recipes:
      </div>

      <div>
        <Button
          v-if="authenticatedUser === user?.id"
          label="New API key"
          @click="
            async () => {
              apiKeysVisible = !apiKeysVisible;
              apiKey =
                (await useFetch('/api/key', { method: 'POST' })).data.value ??
                '';
            }
          "
        />

        <Button
          v-else
          :icon="iconFollowButton"
          :label="labelFollowButton"
          :severity="severityFollowButton"
          @click="changeFollow()"
        />
        <ConfirmDialog />
        <Button
          v-if="authenticatedUser === user?.id"
          label="Delete all API keys"
          icon="pi pi-trash"
          severity="danger"
          class="ml-2"
          @click="confirmDelete"
        />
      </div>
      <Dialog
        v-model:visible="apiKeysVisible"
        modal
        header="Your new API key"
        :style="{ width: '50rem' }"
      >
        <p>This is your new API key:</p>
        <code>{{ apiKey }}</code
        >.
        <p>Do not show it to anyone.</p>
      </Dialog>
    </div>

    <div class="listDiv">
      <RecipesList
        :get-recipes="getUserRecipes"
        :page-size="5"
        class="recipesList"
        hide-username
        highlight-matches
        :initial-query="query"
        :initial-page="page"
        :initial-meal-types="mealTypes"
        :initial-meal-difficulties="mealDifficulties"
        @query-parameters-changed="updateQueryParams"
      />
    </div>
  </div>
</template>

<style scoped>
.profile {
  margin: 8px;
}

.profileInfo {
  display: flex;
  margin-top: 20px;
}

.profileInfoSmall {
  display: flex;
  margin-top: 20px;
}

.profileInfo > .p-avatar {
  margin-top: 2px;
}

.profileInfoSmall > .p-avatar {
  margin-top: 2px;
}

.profileInfo > h1 {
  margin: 0px;
  margin-left: 8px;
}

.profileInfoSmall > h3 {
  margin: 0px;
  margin-left: 8px;
}

.recipesList {
  border: 1px solid var(--surface-100);
}

.profileDiv {
  display: flex;
  justify-content: space-between;
}

.profileDiv > div {
  margin: auto 0px;
}

.info {
  margin-right: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
}

.infoStatic {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.infoStatic:hover {
  cursor: default;
}

.info:hover {
  text-decoration: underline;
  cursor: pointer;
}

.popupWindow {
  width: 40rem;
}

.buttonPopup {
  height: 30px;
  margin-left: 3rem;
  top: 5px;
}
</style>
