<template>
  <div class="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

    <header class="max-w-5xl mx-auto px-6 mb-8 pt-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Deine Analyse</h1>
      <p class="text-slate-400 font-medium">Statistiken basierend auf all deinen Einträgen.</p>
    </header>

    <main class="max-w-5xl mx-auto px-6 pb-20">

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium">Analysiere Daten...</p>
      </div>

      <div v-else-if="foodEntries.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
        <i class="fa-solid fa-chart-pie text-slate-200 text-4xl mb-4"></i>
        <p class="text-slate-400 font-medium">Noch keine Daten für eine Analyse vorhanden.</p>
        <router-link to="/tracker" class="mt-4 inline-block text-indigo-600 text-sm font-bold hover:underline">Zum Tracker</router-link>
      </div>

      <div v-else class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Gesamt Einträge</p>
            <p class="text-4xl font-light text-slate-900">{{ foodEntries.length }}</p>
          </div>

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Ø Kalorien / Mahlzeit</p>
            <p class="text-4xl font-light text-indigo-600">{{ averageCalories }} <span class="text-lg text-slate-400">kcal</span></p>
          </div>

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Größte Mahlzeit</p>
            <p class="text-4xl font-light text-slate-900">{{ maxCalories }} <span class="text-lg text-slate-400">kcal</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="md:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-6 w-full text-left">Makro-Verteilung</h3>
            <div class="relative w-full aspect-square max-w-[250px]">
              <Doughnut :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-6">Gesamtwerte (Alle Zeiten)</h3>

            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                  <span class="text-slate-600">Protein</span>
                  <span class="text-indigo-600">{{ totalMacros.protein.toFixed(0) }}g</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500" :style="{ width: getPercentage('protein') + '%' }"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                  <span class="text-slate-600">Kohlenhydrate</span>
                  <span class="text-emerald-600">{{ totalMacros.carbs.toFixed(0) }}g</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500" :style="{ width: getPercentage('carbs') + '%' }"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                  <span class="text-slate-600">Fett</span>
                  <span class="text-rose-600">{{ totalMacros.fat.toFixed(0) }}g</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-rose-500" :style="{ width: getPercentage('fat') + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-50 text-center">
              <p class="text-xs text-slate-400 uppercase font-bold tracking-widest">Gesamtkalorien erfasst</p>
              <p class="text-3xl font-black text-slate-800 mt-2">{{ totalMacros.calories.toLocaleString() }} kcal</p>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  components: { Doughnut },
  data() {
    return {
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      foodEntries: [],
      isLoading: true,

      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              font: { family: 'sans-serif', size: 11 }
            }
          }
        }
      }
    }
  },
  computed: {
    totalMacros() {
      return this.foodEntries.reduce((acc, item) => {
        acc.protein += item.protein || 0;
        acc.carbs += item.carbohydrates || 0;
        acc.fat += item.fat || 0;
        acc.calories += item.calories || 0;
        return acc;
      }, { protein: 0, carbs: 0, fat: 0, calories: 0 });
    },

    averageCalories() {
      if (this.foodEntries.length === 0) return 0;
      return (this.totalMacros.calories / this.foodEntries.length).toFixed(0);
    },

    // Findet den höchsten Kalorienwert
    maxCalories() {
      if (this.foodEntries.length === 0) return 0;
      return Math.max(...this.foodEntries.map(f => f.calories || 0));
    },

    chartData() {
      return {
        labels: ['Protein', 'Kohlenhydrate', 'Fett'],
        datasets: [
          {
            backgroundColor: ['#6366f1', '#10b981', '#f43f5e'],
            borderWidth: 0,
            data: [
              this.totalMacros.protein,
              this.totalMacros.carbs,
              this.totalMacros.fat
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getPercentage(macro) {
      const total = this.totalMacros.protein + this.totalMacros.carbs + this.totalMacros.fat;
      if (total === 0) return 0;
      return (this.totalMacros[macro] / total) * 100;
    },

    getAuthHeaders() {
      const token = localStorage.getItem('jwt_token');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    },

    async fetchData() {
      this.isLoading = true;
      try {
        const response = await fetch(this.BASE_API_URL, {
          headers: this.getAuthHeaders()
        });

        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('jwt_token');
          this.$router.push('/login');
          return;
        }

        if (response.ok) {
          this.foodEntries = await response.json();
        }
      } catch (e) {
        console.error("Fehler beim Laden der Analyse:", e);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>