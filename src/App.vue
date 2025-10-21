<script setup>
import { ref } from 'vue';
import FoodItem from './components/FoodItem.vue';

const foodList = ref([
  { id: 1, name: 'Apfel', calories: 52 },
  { id: 2, name: 'Banane', calories: 89 },
  { id: 3, name: 'Scheibe Vollkornbrot', calories: 75 }
]);
</script>
<template>
  <main>
    <h1>Kalorientracker</h1>
    <ul>
      <FoodItem v-for="item in foodList" :key="item.id" :food="item" />
    </ul>
  </main>
</template>
<style>
main { max-width: 600px; margin: 1rem auto; font-family: sans-serif; }
ul { padding: 0; }
</style>