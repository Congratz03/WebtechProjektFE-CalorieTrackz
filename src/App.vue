<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FoodItem from './components/FoodItem.vue';

const foodList = ref([]);

onMounted(() => {
  axios.get('https://webtechprojektbe-calorietrackz.onrender.com/api/foods')
    .then(response => {
      foodList.value = response.data;
      console.log("Daten geladen:", response.data);
    })
    .catch(error => {
      console.error("Fehler beim Laden:", error);
    });
});
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