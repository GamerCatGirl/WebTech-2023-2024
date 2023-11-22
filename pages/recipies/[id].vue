<template>
  <div class="card flex justify-content-center">
    <Rating v-model="value" readonly :cancel="false" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const value = ref(3);
</script>
