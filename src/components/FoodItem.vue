<script setup>
defineProps({
  food: { type: Object, required: true }
});

const emit = defineEmits(['delete']);

// Hilfsfunktion zur Formatierung der Makros
// Stellt sicher, dass die Zahl immer zwei Dezimalstellen hat, aber nicht, wenn es eine ganze Zahl ist
const formatMacro = (value) => {
  if (typeof value !== 'number') return '0';
  return parseFloat(value).toFixed(1).replace(/\.0$/, '');
};
</script>

<template>
  <li class="food-item bg-white rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center p-4">

    <div class="flex flex-col">
      <span class="name text-lg text-gray-800 font-semibold">{{ food.name }}</span>

      <div v-if="food.protein || food.carbohydrates || food.fat" class="text-xs text-gray-500 mt-1 flex space-x-3">
        <span v-if="food.protein > 0">
          <strong class="text-green-600">{{ formatMacro(food.protein) }}</strong> P
        </span>
        <span v-if="food.carbohydrates > 0">
          <strong class="text-yellow-600">{{ formatMacro(food.carbohydrates) }}</strong> KH
        </span>
        <span v-if="food.fat > 0">
          <strong class="text-red-600">{{ formatMacro(food.fat) }}</strong> F
        </span>
      </div>
      </div>

    <div class="flex items-center space-x-3 min-w-fit">
      <span class="calories text-blue-600 font-bold">{{ food.calories }} kcal</span>
      <button
          @click="emit('delete', food.id)"
          class="delete-btn text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 focus:outline-none opacity-0 transition-opacity"
          title="Eintrag löschen"
      >
        <i class="fa-solid fa-trash-alt"></i>
      </button>
    </div>
  </li>
</template>

<style scoped>
.food-item:hover .delete-btn {
  opacity: 1;
}
</style>