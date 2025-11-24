<script setup>
defineProps({
  food: { type: Object, required: true }
});

const emit = defineEmits(['delete']);
</script>

<template>
  <li class="food-item bg-white rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center p-4">
    <span class="name text-lg text-gray-800 font-semibold">{{ food.name }}</span>
    <div class="flex items-center space-x-3">
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
