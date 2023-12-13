<template>
  <Button v-if="user === recipy.user" icon="pi pi-file-edit" severity="success" label="Edit recipe" @click="() => navigateTo(`/recipes/${id}/edit`)"></Button>

  <TabView>
    <TabPanel header="Info">
      <Card class="InfoCard">
        <template #title>
          {{ recipyName }}

          <div>
            <!-- TODO: add a share button -->
          </div>

          <!-- TODO: add user possibility to rate -->
          <div class="flex flex-wrap gap-2">
            <Rating v-model="valueRating" />
            <Button label="Rate" icon="pi pi-check" size="small" rounded />
          </div>
        </template>
        <template #content>
          <!--Insert a picture-->
          <div class="card flex">
            <Image
              @click="console.log(recipy.thumbnail)"
              class="imageCard"
              :src="recipy.thumbnail"
              alt="Image"
              width="auto"
            />
          </div>

          <div class="flex flex-column md:flex-row">
            <div
              class="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5"
            >
              <div
                class="flex flex-wrap justify-content-center align-items-center gap-2"
              >
                <Tag :value="recipy.type"></Tag>
                <Tag
                  icon=""
                  :value="recipy.difficulty"
                  :severity="getColorDifficulty(recipy.difficulty)"
                ></Tag>
                <Tag
                  icon="pi pi-clock"
                  :value="recipy.time"
                  :severity="getSeverity(recipy.time)"
                  rounded
                ></Tag>
              </div>

              <p class="m-0">Made by @Silken</p>
              <!--Display figures like meat, vegi, halal, vegan, ...-->
              <div class="card flex">
                <Rating
                  v-model="recipyScore"
                  readonly
                  :cancel="false"
                  class="flex gap-2"
                />
              </div>
            </div>

            <div class="w-full md:w-2">
              <Divider layout="vertical" class="hidden md:flex"
                ><b></b
              ></Divider>
              <Divider
                layout="horizontal"
                class="flex md:hidden"
                align="center"
              >
                <b></b>
              </Divider>
            </div>
            <div class="align-content-end align-items-end">
              <p>Share Recipe</p>

              <div
                class="flex-column flex align-items-center justify-content-end gap-2"
              >
                <SocialShare
                  v-for="network in [
                    'facebook',
                    'twitter',
                    'linkedin',
                    'email',
                    'whatsapp',
                  ]"
                  :key="network"
                  :network="network"
                  :styled="true"
                  :label="false"
                  class="p-2 rounded-none"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- TODO: put vertical bar in card and in the right a pin on the map of the recipy -->
      </Card>
    </TabPanel>

	<TabPanel header="Ingredients">
		<DataTable :value="ingredients" tableStyle="min-width: 50rem">
			<Column field="ingredient" header="Ingredient"/>
			<Column field="amount" header="Amount">
				<template #body="{ data }">
					<div v-if="data.requestStatus === 'success'">{{ data.amount }}</div>
					<Skeleton v-else width="3em" height="2em"></Skeleton>
				</template>
			</Column>
			<Column field="unit" header="Unit">
				<template #body="{ data }">
					<Dropdown v-if="data.unitType === UnitType.Mass" :options="massUnits" v-model="data.unit" :option-label="(unit) => unitNames[unit]" />
					<Dropdown v-else-if="data.unitType === UnitType.Volume" :options="volumeUnits" v-model="data.unit" :option-label="(unit) => unitNames[unit]" />
					<Dropdown v-else v-model="data.unit" :options="[data.unit]" disabled />
				</template>
			</Column>
			<Column field="category" header="Category"/>
		</DataTable>
	</TabPanel>


  <TabPanel header="Recipe">
    <Editor v-model="recipeSteps" editorStyle="height: 320px" readonly />
  </TabPanel>

  <!-- TODO: fix the layout of this horizontal bar -->
  <TabPanel header="Comments">
    <!-- input text -->
    <Textarea v-model="addComment" rows="1" cols="90" />
    <!-- TODO: make this dynamic!!!! -->
    <!--  cancel button -->
    <Button label="Cancel" severity="warning" rounded />
    <!--  comment button -->
    <Button label="Comment" severity="success" @click="comment()" rounded>
    </Button>

    <div v-for="comment in comments">
      <Divider align="right" type="solid">
        <b>{{ comment.user }}</b>
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

          <Textarea
            v-show="comment.addReaction"
            v-model="addReaction"
            rows="1"
            cols="90"
          />
          <Button
            label="Cancel"
            rounded
            severity="warning"
            v-show="comment.addReaction"
            @click="comment.addReaction = false"
          />
          <Button label="Answer" rounded @click="comment.addReaction = true" />
          <Button
            label="... reactions"
            icon="pi pi-angle-down"
            @click="switchAddReaction(comment)"
            text
          />
        </div>
      </div>
      <div v-for="reaction in comment.reactions" v-show="comment.showReaction">
        <Divider align="left gap-3" type="solid">
          <b>{{ reaction.user }}</b
          >: {{ reaction.comment }}
          <!--TODO: add like or dislike button -->
          <!-- like button -->
          <Button icon="pi pi-thumbs-up" severity="success" rounded />
          <!-- amount of likes -->

          <span class="amountStyle">{{ reaction.likes }}</span>
          <!-- dislike button -->
          <Button icon="pi pi-thumbs-down" severity="danger" rounded />
        </Divider>
      </div>
    </div>
  </TabPanel>
  </TabView>
</template>

<script setup>
import { ref } from "vue";
const { data } = useAuth();
const user = data.value?.user?.id ?? ""
const value = ref(3); //score of recipy still needs to be added in the database
const valueRating = ref();
const route = useRoute();
const id = route.params.id;
const loggedInUser = 2; //data.id // TODO: make this work with the logged in user
const comboRouting = "&";
const splitedId = id.split(comboRouting);

const recipy = (await useFetch(`/api/recipes/${id}`)).data.value;
if (!recipy)
	showError({
	  statusCode: 404,
	  statusMessage: "This recipe does not exist."
	})

const recipyScore = ref(Number(recipy.score));

const comments = ref(recipy.comments);

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

  console.log("like :)");
  await $fetch(`/api/comments/${idOfComment}`, {
    method: "put",
    body: commentPost,
  });
}

async function setupReaction() {
  comments.value.map((comment) => {
    comment.showReaction = false;
    comment.addReaction = false;
    comment.severityLike = "Primary";
    comment.logedInUser = loggedInUser;

    // TODO: if userID = currentUser than add button to delete comment

    // TODO: if comment is liked by  = currentUser than display the likes

    //let user = await $fetch(`/api/users/${comment.userID}`)

    //comment.user = "Need to be replaced"//user.name;

    //test
    comment.reactions = [
      {
        comment: "reaction test",
        user: "Username 2",
        likes: 2,
      },
      {
        comment: "reaction test 2",
        user: "Username 3",
        likes: 3,
      },
    ];
  });
}

setupReaction();

const recipyName = recipy.name;
const recipeSteps = ref(recipy.recipe);
const ingredients = await Promise.all(recipy.ingredients.map(async (ingredient) => {
	if (ingredient.unitType === UnitType.Custom) {
		ingredient.requestStatus = "success"
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
	ingredient.requestStatus = status
	ingredient.amount = data;

	return ingredient;
}));
// console.log(ingredients)

const massUnits = [...Object.values(MassUnit)]
const volumeUnits = [...Object.values(VolumeUnit)]

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
    user: "2",
    likes: 0,
    recipe: id,
  };

  const { postComment } = await $fetch("/api/comments", {
    method: "post",
    body: commentData,
  });

  // TODO: vervang "Silken door userID fetch username"
  const user = await $fetch(`/api/users/${commentData.user}`);
  console.log(user);
  commentData.user = user.name;

  comments.value.unshift(commentData);

  //TODO: clear the input bar
}

//const recipyName
</script>

<style scoped>
.InfoCard {
  width: 80%;
  margin: auto;
}

.imageCard {
  width: 10%;
}

.amountStyle {
  font-size: 35px;
}

.p-editor-toolbar {
	display: none;
}

.p-editor-content {
	border: 1px solid var(--surface-border) !important;
	border-radius: var(--border-radius);
	overflow: hidden;
}
</style>
