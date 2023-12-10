<template>
  <RecipeEdit />
</template>

<script>
//imports
import { resetVariables, idRecipe, userID, setUserID } from "~/composables/edit_add"


//put all values to original values first
resetVariables();
setUserID(2);

</script>
