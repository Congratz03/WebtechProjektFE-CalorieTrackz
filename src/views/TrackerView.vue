<template>
  <div class="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

    <!-- HEADER: Statistiken & Buttons -->
    <header class="max-w-5xl mx-auto px-6 mb-12 pt-8">
      <div class="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <p class="text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">{{ currentDate }}</p>
          <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Dein Überblick</h1>
        </div>

        <div class="flex flex-wrap gap-2">
          <!-- Neuer Button: Rezept Speichern -->
          <button @click="openSaveRecipeModal"
                  class="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <i class="fa-regular fa-bookmark mr-1"></i> Speichern
          </button>

          <!-- Neuer Button: Rezepte Laden -->
          <button @click="fetchRecipes"
                  class="bg-white text-slate-600 border border-slate-200 px-4 py-2.5 rounded-full text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <i class="fa-solid fa-book-open mr-1"></i> Rezepte
          </button>

          <!-- Button: Normaler Eintrag -->
          <button @click="openAddModal"
                  class="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-all duration-300 shadow-sm active:scale-95">
            + <span class="hidden sm:inline ml-1">Eintrag</span>
          </button>
        </div>
      </div>

      <!-- Statistik-Karten -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white flex flex-col justify-between relative overflow-hidden">
          <div class="relative z-10">
            <span class="text-slate-400 text-xs font-bold uppercase tracking-widest">Heute konsumiert</span>
            <div class="flex items-baseline space-x-2 mt-2">
              <span class="text-6xl font-light text-slate-900">{{ consumedCalories }}</span>
              <span class="text-xl text-slate-400 font-medium">/ {{ GOAL_CALORIES }} kcal</span>
            </div>
          </div>
          <div class="mt-8 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                 :style="{ width: Math.min((consumedCalories / GOAL_CALORIES) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div :class="remainingCalories >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'"
             class="p-8 rounded-[2rem] border flex flex-col justify-center transition-colors duration-500">
          <span class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{{ remainingDisplayText }}</span>
          <div class="text-4xl font-bold tracking-tight" :class="remainingCalories >= 0 ? 'text-emerald-600' : 'text-rose-600'">
            {{ Math.abs(remainingCalories) }} <span class="text-lg font-medium opacity-70">kcal</span>
          </div>
        </div>
      </div>

      <!-- Makro-Karten -->
      <div class="mt-6 grid grid-cols-3 gap-4">
        <div class="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-center hover:bg-amber-50 transition-colors">
          <div class="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mb-1">Protein</div>
          <div class="text-xl font-bold text-amber-700">
            {{ totalProtein }}<span class="text-sm font-normal ml-0.5 text-amber-400">g</span>
          </div>
        </div>
        <div class="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-center hover:bg-emerald-50 transition-colors">
          <div class="text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-400 mb-1">Carbs</div>
          <div class="text-xl font-bold text-emerald-700">
            {{ totalCarbohydrates }}<span class="text-sm font-normal ml-0.5 text-emerald-400">g</span>
          </div>
        </div>
        <div class="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-center hover:bg-rose-50 transition-colors">
          <div class="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400 mb-1">Fett</div>
          <div class="text-xl font-bold text-rose-700">
            {{ totalFat }}<span class="text-sm font-normal ml-0.5 text-rose-400">g</span>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN: Liste der Mahlzeiten -->
    <main class="max-w-5xl mx-auto px-6 pb-20">
      <div class="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">Heutige Mahlzeiten</h2>
        <div class="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
          {{ foodEntries.length }} Einträge
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium">Daten werden synchronisiert...</p>
      </div>

      <div v-else-if="foodEntries.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
        <i class="fa-solid fa-utensils text-slate-200 text-4xl mb-4"></i>
        <p class="text-slate-400 font-medium">Noch keine Einträge für heute.</p>
        <button @click="openAddModal" class="mt-4 text-indigo-600 text-sm font-bold hover:underline">Jetzt erste Mahlzeit erfassen</button>
      </div>

      <ul v-else class="grid grid-cols-1 gap-4">
        <FoodItem
            v-for="food in foodEntries"
            :key="food.id"
            :food="food"
            @delete="deleteFoodEntry"
            class="group"
        />
      </ul>
    </main>

    <!-- MODAL: Eintrag Hinzufügen (Suche) -->
    <transition name="modal">
      <div v-show="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeAddModal"></div>
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
          <div class="px-8 pt-8 pb-6 border-b border-slate-50">
            <h3 class="text-2xl font-bold text-slate-900 tracking-tight">Neuer Eintrag</h3>
            <p class="text-sm text-slate-400 mt-1">Nutze die Suche für präzise Nährwerte.</p>
          </div>
          <form @submit.prevent="addFoodEntry" class="p-8">
            <div class="mb-6">
              <label class="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Suchen</label>
              <div class="relative group">
                <input type="text" v-model="searchQuery" @input="searchFood"
                       placeholder="z.B. 300g prime rib"
                       class="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300 text-slate-700">
                <i v-if="isSearching" class="fa-solid fa-spinner fa-spin absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
                <i v-else class="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-400 transition-colors"></i>
              </div>
              <div v-if="searchResults.length > 0" class="mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                <div v-for="product in searchResults" :key="product.name" @click="selectProduct(product)"
                     class="p-4 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0 transition-colors">
                  <span class="font-bold text-sm text-slate-700">{{ product.name }}</span>
                  <span class="text-xs font-bold text-indigo-500">{{ product.calories }} kcal</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 mb-8">
              <input type="text" v-model="newEntry.name" placeholder="Name" required
                     class="w-full border-b border-slate-100 py-2 focus:border-indigo-500 outline-none transition-colors font-medium">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div v-for="macro in ['calories', 'protein', 'carbohydrates', 'fat']" :key="macro">
                  <label class="block text-[10px] font-bold uppercase tracking-tighter text-slate-400 mb-1">
                    <span v-if="macro === 'calories'">Kcal</span>
                    <span v-else-if="macro === 'protein'">Prot</span>
                    <span v-else-if="macro === 'carbohydrates'">Carbs</span>
                    <span v-else-if="macro === 'fat'">Fett</span>
                  </label>
                  <input type="number" v-model.number="newEntry[macro]" step="0.1"
                         class="w-full bg-slate-50 rounded-lg p-2 text-sm font-bold text-slate-700 border-none focus:ring-1 focus:ring-indigo-500/20">
                </div>
              </div>
            </div>
            <div class="flex space-x-3">
              <button type="button" @click="closeAddModal" class="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Abbrechen</button>
              <button type="submit" class="flex-[2] bg-indigo-600 text-white rounded-2xl py-4 text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Speichern</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- MODAL: Rezept Speichern -->
    <transition name="modal">
      <div v-show="showSaveRecipeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showSaveRecipeModal = false"></div>
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10">
          <div class="p-8">
            <h3 class="text-2xl font-bold text-slate-900 mb-4">Rezept erstellen</h3>
            <p class="text-sm text-slate-500 mb-6">Wähle die Zutaten aus deiner heutigen Liste, die zum Rezept gehören.</p>

            <input type="text" v-model="newRecipeName" placeholder="Rezept Name (z.B. Mein Frühstück)"
                   class="w-full bg-slate-50 border-none rounded-xl p-4 mb-6 focus:ring-2 focus:ring-indigo-500/20">

            <div class="max-h-60 overflow-y-auto mb-6 space-y-2 pr-2">
              <div v-for="entry in foodEntries" :key="entry.id" class="flex items-center p-3 bg-slate-50 rounded-xl">
                <input type="checkbox" :value="entry.id" v-model="selectedForRecipe" class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 mr-3">
                <span class="text-sm font-medium text-slate-700">{{ entry.name }} ({{ entry.calories }} kcal)</span>
              </div>
            </div>

            <div class="flex space-x-3">
              <button @click="showSaveRecipeModal = false" class="flex-1 py-3 text-sm font-bold text-slate-400">Abbrechen</button>
              <button @click="saveRecipe" class="flex-[2] bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700">Rezept Speichern</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- MODAL: Rezept Laden -->
    <transition name="modal">
      <div v-show="showLoadRecipeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showLoadRecipeModal = false"></div>
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 max-h-[80vh] flex flex-col">
          <div class="p-8 pb-4 border-b border-slate-50">
            <h3 class="text-2xl font-bold text-slate-900">Meine Rezepte</h3>
          </div>

          <div class="overflow-y-auto p-8 pt-4 flex-grow">
            <div v-if="recipes.length === 0" class="text-center text-slate-400 py-8">
              Noch keine Rezepte gespeichert.
            </div>

            <div v-for="recipe in recipes" :key="recipe.id" class="mb-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-100 transition-colors group">
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-bold text-slate-800 text-lg">{{ recipe.name }}</h4>
                <button @click="deleteRecipe(recipe.id)" class="text-slate-300 hover:text-rose-500 px-2">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              <p class="text-xs text-slate-400 mb-4">{{ recipe.ingredients.length }} Zutaten</p>

              <button @click="loadRecipeIntoTracker(recipe)"
                      class="w-full bg-white border border-indigo-100 text-indigo-600 font-bold py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors">
                Zum Tag hinzufügen
              </button>
            </div>
          </div>

          <div class="p-6 border-t border-slate-50 text-center">
            <button @click="showLoadRecipeModal = false" class="text-slate-400 font-bold text-sm">Schließen</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import FoodItem from '../components/FoodItem.vue';

export default {
  components: { FoodItem },
  data() {
    return {
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      SEARCH_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/search',
      USER_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/users/me',
      RECIPE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/recipes',

      GOAL_CALORIES: 2000,
      foodEntries: [],
      newEntry: { name: '', calories: null, protein: 0, carbohydrates: 0, fat: 0 },
      showAddModal: false,
      isLoading: true,
      currentDate: '',
      searchQuery: '',
      searchResults: [],
      isSearching: false,

      // --- Rezept Variablen ---
      recipes: [],
      showSaveRecipeModal: false,
      showLoadRecipeModal: false,
      newRecipeName: '',
      selectedForRecipe: [],
    };
  },
  computed: {
    consumedCalories() {
      return this.foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    },
    totalProtein() {
      return this.foodEntries.reduce((sum, entry) => sum + (entry.protein || 0), 0).toFixed(1);
    },
    totalCarbohydrates() {
      return this.foodEntries.reduce((sum, entry) => sum + (entry.carbohydrates || 0), 0).toFixed(1);
    },
    totalFat() {
      return this.foodEntries.reduce((sum, entry) => sum + (entry.fat || 0), 0).toFixed(1);
    },
    remainingCalories() {
      return this.GOAL_CALORIES - this.consumedCalories;
    },
    remainingDisplayText() {
      return this.remainingCalories >= 0 ? 'Verbleibend' : 'Überschuss';
    }
  },
  mounted() {
    this.currentDate = new Date().toLocaleDateString('de-DE', {weekday: 'long', day: 'numeric', month: 'long'});
    this.fetchFoodEntries();
    this.fetchUserGoal();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('jwt_token');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    },

    handleAuthError(response) {
      if (response.status === 403 || response.status === 401) {
        alert("Deine Sitzung ist abgelaufen. Bitte logge dich erneut ein.");
        localStorage.removeItem('jwt_token');
        this.$router.push('/login');
        return true;
      }
      return false;
    },

    openAddModal() { this.showAddModal = true; },
    closeAddModal() {
      this.showAddModal = false;
      this.newEntry = { name: '', calories: null, protein: 0, carbohydrates: 0, fat: 0 };
      this.searchQuery = '';
      this.searchResults = [];
    },

    async searchFood() {
      if (this.searchQuery.length < 3) { this.searchResults = []; return; }
      this.isSearching = true;
      try {
        const response = await fetch(`${this.SEARCH_API_URL}?query=${this.searchQuery}`, {
          headers: this.getAuthHeaders()
        });

        if (this.handleAuthError(response)) return;

        if (response.ok) this.searchResults = await response.json();
      } catch (error) { console.error("Suche fehlgeschlagen", error); }
      finally { this.isSearching = false; }
    },

    selectProduct(product) {
      Object.assign(this.newEntry, product);
      this.searchResults = [];
      this.searchQuery = '';
    },

    async fetchFoodEntries() {
      this.isLoading = true;
      try {
        const response = await fetch(this.BASE_API_URL, {
          headers: this.getAuthHeaders()
        });

        if (this.handleAuthError(response)) return;

        if (response.ok) this.foodEntries = await response.json();
        else throw new Error('Fehler beim Laden der Daten');

      } catch (error) { console.error(error); }
      finally { this.isLoading = false; }
    },

    async addFoodEntry() {
      try {
        const response = await fetch(this.BASE_API_URL, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(this.newEntry)
        });

        if (this.handleAuthError(response)) return;

        if (response.ok) { this.closeAddModal(); this.fetchFoodEntries(); }
      } catch (error) { console.error("Speichern fehlgeschlagen"); }
    },

    async deleteFoodEntry(id) {
      if (!confirm(`Eintrag wirklich entfernen?`)) return;

      const response = await fetch(`${this.BASE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (this.handleAuthError(response)) return;

      this.fetchFoodEntries();
    },

    async fetchUserGoal() {
      try {
        const response = await fetch(this.USER_API_URL, {
          headers: this.getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          if (data.targetCalories) {
            this.GOAL_CALORIES = Math.round(data.targetCalories);
          }
        }
      } catch (error) {
        console.error("Konnte User-Ziel nicht laden", error);
      }
    },

    // --- REZEPT LOGIK START ---
    openSaveRecipeModal() {
      if (this.foodEntries.length === 0) {
        alert("Du hast heute noch nichts gegessen, was man speichern könnte!");
        return;
      }
      this.newRecipeName = '';
      this.selectedForRecipe = this.foodEntries.map(entry => entry.id);
      this.showSaveRecipeModal = true;
    },

    async saveRecipe() {
      if (!this.newRecipeName) return;

      const ingredients = this.foodEntries
          .filter(entry => this.selectedForRecipe.includes(entry.id))
          .map(entry => ({
            name: entry.name,
            calories: entry.calories,
            protein: entry.protein,
            carbohydrates: entry.carbohydrates,
            fat: entry.fat
          }));

      if (ingredients.length === 0) {
        alert("Wähle mindestens eine Zutat aus.");
        return;
      }

      const payload = {
        name: this.newRecipeName,
        ingredients: ingredients
      };

      try {
        const response = await fetch(this.RECIPE_API_URL, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert("Rezept erfolgreich gespeichert!");
          this.showSaveRecipeModal = false;
        }
      } catch (e) {
        console.error("Fehler beim Speichern:", e);
      }
    },

    async fetchRecipes() {
      this.showLoadRecipeModal = true;
      try {
        const response = await fetch(this.RECIPE_API_URL, {
          headers: this.getAuthHeaders()
        });
        if (response.ok) {
          this.recipes = await response.json();
        }
      } catch (e) {
        console.error("Konnte Rezepte nicht laden", e);
      }
    },

    async loadRecipeIntoTracker(recipe) {
      if (!confirm(`Möchtest du "${recipe.name}" zu deinem Tag hinzufügen?`)) return;

      this.isLoading = true;
      this.showLoadRecipeModal = false;

      for (const ingredient of recipe.ingredients) {
        this.newEntry = { ...ingredient };
        await this.addFoodEntry();
      }

      this.isLoading = false;
    },

    async deleteRecipe(id) {
      if(!confirm("Rezept wirklich löschen?")) return;
      await fetch(`${this.RECIPE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      this.fetchRecipes();
    }
    // --- REZEPT LOGIK END ---
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
</style>
