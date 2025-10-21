<script setup>
defineProps({
  food: { type: Object, required: true }
});
</script>
<template>
  <li class="food-item">
    <span class="name">{{ food.name }}</span>
    <span class="calories">{{ food.calories }} kcal</span>
  </li>
</template>
<style scoped>
.food-item { list-style: none; border: 1px solid #ddd; padding: 10px; margin-bottom: 5px; display: flex; justify-content: space-between; }
.name { font-weight: bold; }
</style>