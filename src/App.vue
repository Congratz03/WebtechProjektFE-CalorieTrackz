<template>
  <div class="min-h-screen flex flex-col">

    <nav class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow z-50 flex items-center px-4 md:px-8">
      <div class="text-2xl font-bold text-blue-600 mr-8 min-w-fit">CalorieTrackz</div>

      <div class="flex space-x-4 md:space-x-8 text-sm font-medium overflow-x-auto">
        <a href="#" class="nav-link active flex items-center p-2 text-blue-600 whitespace-nowrap">
          <i class="fa-solid fa-home mr-2"></i> Home
        </a>

        <button @click="openAddModal"
                class="nav-link flex items-center p-2 text-gray-500 hover:text-blue-600 transition whitespace-nowrap">
          <i class="fa-solid fa-plus mr-2"></i> Eintrag Hinzufügen
        </button>

        <a href="#" class="nav-link flex items-center p-2 text-gray-500 hover:text-blue-600 transition whitespace-nowrap">
          <i class="fa-solid fa-chart-bar mr-2"></i> Analyse
        </a>

        <a href="#" class="nav-link flex items-center p-2 text-gray-500 hover:text-blue-600 transition whitespace-nowrap">
          <i class="fa-solid fa-user mr-2"></i> Profil
        </a>

        <a href="#" class="nav-link flex items-center p-2 text-gray-500 hover:text-blue-600 transition whitespace-nowrap">
          <i class="fa-solid fa-cog mr-2"></i> Einstellungen
        </a>
      </div>
    </nav>

    <div id="app-content" class="flex-grow pt-16">

      <header class="bg-white shadow p-6 md:p-8">
        <h1 class="text-3xl font-bold text-gray-800">Überlick des Tages</h1>
        <p class="text-sm text-gray-500 mt-1">Tägliche Zusammenfassung - <span>{{ currentDate }}</span></p>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <div class="text-xl font-bold">{{ GOAL_CALORIES }}</div>
            <div class="text-xs opacity-80">Ziel (kcal)</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-md">
            <div class="text-xl font-bold text-gray-800">{{ consumedCalories }}</div>
            <div class="text-xs text-gray-500">Konsumiert</div>
          </div>
          <div :class="remainingClass" class="p-4 rounded-lg shadow-md">
            <div class="text-xl font-bold">{{ Math.abs(remainingCalories) }}</div>
            <div class="text-xs">{{ remainingDisplayText }}</div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
            <div class="bg-green-100 text-green-700 p-3 rounded-lg shadow-sm">
                <div class="text-lg font-bold">{{ totalProtein }} g</div>
                <div class="text-xs">Protein</div>
            </div>
            <div class="bg-yellow-100 text-yellow-700 p-3 rounded-lg shadow-sm">
                <div class="text-lg font-bold">{{ totalCarbohydrates }} g</div>
                <div class="text-xs">Kohlenhydrate</div>
            </div>
            <div class="bg-red-100 text-red-700 p-3 rounded-lg shadow-sm">
                <div class="text-lg font-bold">{{ totalFat }} g</div>
                <div class="text-xs">Fett</div>
            </div>
        </div>

      </header>

      <main class="p-4 md:p-8 max-w-4xl mx-auto w-full">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Deine Einträge heute</h2>

        <div v-if="isLoading" class="text-center py-12 text-gray-500">
          <i class="fa-solid fa-spinner fa-spin text-3xl"></i>
          <p class="mt-2">Lade Einträge...</p>
        </div>

        <p v-else-if="errorMessage && foodEntries.length === 0" class="text-red-500 text-center py-4">
          Konnte Daten nicht laden: {{ errorMessage }}. Stelle sicher, dass das Backend unter {{ BASE_API_URL }} läuft.
        </p>

        <p v-else-if="foodEntries.length === 0" class="text-center text-gray-500 mt-8">
          Noch keine Einträge vorhanden.
        </p>

        <ul v-else class="space-y-3">
          <FoodItem
                v-for="food in foodEntries"
                :key="food.id"
                :food="food"
                @delete="deleteFoodEntry"
            />
        </ul>
      </main>

    </div>

    <div v-show="showAddModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
            <h3 class="text-xl font-bold mb-4">Neuen Eintrag hinzufügen</h3>

            <form @submit.prevent="addFoodEntry">

                <div class="mb-4">
                    <label for="food-search" class="block text-sm font-medium text-gray-700">Lebensmittel suchen (Open Food Facts)</label>
                    <div class="relative">
                        <input type="text" id="food-search" v-model="searchQuery" @input="searchFood"
                               placeholder="Z.B. Apfel, Käse..."
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                        <i v-if="isSearching" class="fa-solid fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"></i>
                    </div>
                </div>

                <div v-if="searchResults.length > 0" class="mb-4 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                    <ul class="divide-y divide-gray-100">
                        <li v-for="(product, index) in searchResults" :key="index"
                            @click="selectProduct(product)"
                            class="p-2 text-sm cursor-pointer hover:bg-blue-50 transition flex justify-between items-center">
                            <span class="font-medium text-gray-800 truncate">{{ product.name }}</span>
                            <span class="text-blue-600 font-semibold ml-2 min-w-fit">{{ product.calories }} kcal / 100g</span>
                        </li>
                    </ul>
                </div>

                <div class="mb-4">
                    <label for="food-name" class="block text-sm font-medium text-gray-700">Name des Lebensmittels</label>
                    <input type="text" id="food-name" v-model="newEntry.name" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label for="food-calories" class="block text-sm font-medium text-gray-700">Kalorien (kcal)</label>
                        <input type="number" id="food-calories" v-model.number="newEntry.calories" required min="1"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="food-protein" class="block text-sm font-medium text-gray-700">Protein (g)</label>
                        <input type="number" id="food-protein" v-model.number="newEntry.protein" min="0"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="food-carbs" class="block text-sm font-medium text-gray-700">Kohlenhydrate (g)</label>
                        <input type="number" id="food-carbs" v-model.number="newEntry.carbohydrates" min="0"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="food-fat" class="block text-sm font-medium text-gray-700">Fett (g)</label>
                        <input type="number" id="food-fat" v-model.number="newEntry.fat" min="0"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="button" @click="closeAddModal"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                      Abbrechen
                    </button>
                    <button type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Speichern
                    </button>
                </div>
            </form>

            <p v-if="errorMessage && !isLoading" class="text-red-500 mt-3">{{ errorMessage }}</p>
          </div>
        </div>
  </div>
</template>

<script>


export default {

  // 1. Initialer Zustand der Komponente (Daten)
  data() {
    return {
      // Konstanten
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      SEARCH_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/search',
      DETAIL_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/search/details',
      GOAL_CALORIES: 2000,

      // Zustand
      foodEntries: [],
      newEntry: { name: '', calories: null, protein: 0, carbohydrates: 0, fat: 0 },
      showAddModal: false,
      isLoading: true,
      errorMessage: null,
      currentDate: '',

      // Suchzustand für Open Food Facts
      searchQuery: '',
      searchResults: [],
      isSearching: false,
    };
  },

  // 2. Berechnete Eigenschaften
  computed: {
    consumedCalories() {
      return this.foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    },
    // Gesamt-Protein
    totalProtein() {
        return this.foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0).toFixed(1);
    },
    // Gesamt-Kohlenhydrate
    totalCarbohydrates() {
        return this.foodEntries.reduce((sum, entry) => sum + (entry.carbohydrates || 0), 0).toFixed(1);
    },
    // Gesamt-Fett
    totalFat() {
        return this.foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0).toFixed(1);
    },
    remainingCalories() {
      return this.GOAL_CALORIES - this.consumedCalories;
    },
    remainingClass() {
      return this.remainingCalories >= 0
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white';
    },
    remainingDisplayText() {
      return this.remainingCalories >= 0
          ? 'Verbleibend'
          : 'Überschuss (kcal)';
    }
  },

  // 3. Lebenszyklus-Hook
  mounted() {
    this.currentDate = new Date().toLocaleDateString('de-DE', {weekday: 'long', day: 'numeric', month: 'long'});
    this.fetchFoodEntries();
  },

  // 4. Methoden
  methods: {
    openAddModal() {
      this.showAddModal = true;
      this.errorMessage = null;
    },

    closeAddModal() {
      this.showAddModal = false;
      this.newEntry = { name: '', calories: null, protein: 0, carbohydrates: 0, fat: 0 };
      this.searchQuery = '';
      this.searchResults = [];
    },

    // Open Food Facts Suchfunktion
    async searchFood() {
      if (this.searchQuery.length < 3) {
        this.searchResults = [];
        return;
      }

      this.isSearching = true;
      this.errorMessage = null;

      try {
        const response = await fetch(`${this.SEARCH_API_URL}?query=${this.searchQuery}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Suchfehler! Status: ${response.status}`);
        }

        const products = await response.json();

        // Daten von Open Food Facts filtern und aufbereiten
        this.searchResults = products
          .filter(p => p.product_name && p.nutriments && p.nutriments.energy_kcal_100g)
          .map(p => ({
            name: p.product_name,
            calories: Math.round(p.nutriments.energy_kcal_100g || 0),
            protein: parseFloat((p.nutriments.proteins_100g || 0).toFixed(1)),
            carbohydrates: parseFloat((p.nutriments.carbohydrates_100g || 0).toFixed(1)),
            fat: parseFloat((p.nutriments.fat_100g || 0).toFixed(1)),
          }));

      } catch (error) {
        console.error("Fehler bei der Suche:", error);
        this.errorMessage = "Suche fehlgeschlagen.";
      } finally {
        this.isSearching = false;
      }
    },

    // Übernimmt die Daten eines gefundenen Produkts in das Eingabeformular
    selectProduct(product) {
      this.newEntry.name = product.name + ' (100g)';
      this.newEntry.calories = product.calories;
      this.newEntry.protein = product.protein;
      this.newEntry.carbohydrates = product.carbohydrates;
      this.newEntry.fat = product.fat;

      this.searchResults = [];
      this.searchQuery = '';
    },

    // Lädt alle Einträge
    async fetchFoodEntries() {
      this.isLoading = true;
      this.errorMessage = null;
      try {
        const response = await fetch(this.BASE_API_URL, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const data = await response.json();
        this.foodEntries = data;
      } catch (error) {
        console.error("Fehler beim Laden der Einträge:", error);
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Fügt einen neuen Eintrag hinzu
    async addFoodEntry() {
      if (!this.newEntry.name || !this.newEntry.calories) return;
      this.errorMessage = null;

      const entryToSend = {
          name: this.newEntry.name,
          calories: this.newEntry.calories,
          protein: this.newEntry.protein || 0,
          carbohydrates: this.newEntry.carbohydrates || 0,
          fat: this.newEntry.fat || 0
      };

      try {
        const response = await fetch(this.BASE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(entryToSend)
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Speichern fehlgeschlagen (Status: ${response.status}).`);
        }

        this.closeAddModal();
        this.fetchFoodEntries();

      } catch (error) {
        console.error("Fehler beim Hinzufügen des Eintrags:", error);
        this.errorMessage = `Speichern fehlgeschlagen: ${error.message}`;
      }
    },

    // Löscht einen Eintrag
    async deleteFoodEntry(id) {
      if (!window.confirm(`Soll der Eintrag mit ID ${id} wirklich gelöscht werden?`)) {
        return;
      }
      try {
        const response = await fetch(`${this.BASE_API_URL}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.fetchFoodEntries();
        } else {
          throw new Error(`Löschen fehlgeschlagen (Status: ${response.status})`);
        }
      } catch (error) {
        console.error("Fehler beim Löschen des Eintrags:", error);
        alert(`Löschen fehlgeschlagen: ${error.message}`);
      }
    }
  }
}
</script>

<style scoped>
.nav-link {
  transition: color 0.2s;
}
.nav-link.active {
  color: #3b82f6;
  font-weight: 600;
}
.delete-btn {
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
}
.food-item:hover .delete-btn {
  opacity: 1;
}
</style>