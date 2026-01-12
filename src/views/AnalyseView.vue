<template>
  <div class="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

    <header class="max-w-5xl mx-auto px-6 mb-8 pt-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Deine Analyse</h1>
      <p class="text-slate-400 font-medium">Statistiken basierend auf deinen getrackten Tagen.</p>
    </header>

    <main class="max-w-5xl mx-auto px-6 pb-20">

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium">Lade Daten...</p>
      </div>

      <div v-else-if="foodEntries.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
        <i class="fa-solid fa-chart-pie text-slate-200 text-4xl mb-4"></i>
        <p class="text-slate-400 font-medium">Noch keine Einträge vorhanden.</p>
        <p class="text-xs text-slate-400 mt-2">Füge im Tracker Mahlzeiten hinzu, um hier Statistiken zu sehen.</p>
        <router-link to="/tracker" class="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors">
          Zum Tracker
        </router-link>
      </div>

      <div v-else class="space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Ø Tägl. Kalorien</p>
              <p class="text-4xl font-light text-indigo-600">
                {{ averageDailyCalories }} <span class="text-lg text-slate-400 font-normal">kcal</span>
              </p>
            </div>
            <i class="fa-solid fa-fire absolute -bottom-2 -right-2 text-6xl text-slate-50 opacity-50 transform rotate-12"></i>
          </div>

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Ø Tägl. Protein</p>
              <p class="text-4xl font-light text-emerald-600">
                {{ averageDailyProtein }} <span class="text-lg text-slate-400 font-normal">g</span>
              </p>
            </div>
            <i class="fa-solid fa-drumstick-bite absolute -bottom-2 -right-2 text-6xl text-slate-50 opacity-50 transform -rotate-12"></i>
          </div>

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Aktive Tage</p>
              <p class="text-4xl font-light text-slate-900">
                {{ uniqueDaysCount }} <span class="text-lg text-slate-400 font-normal">Tage</span>
              </p>
            </div>
            <i class="fa-solid fa-calendar-check absolute -bottom-2 -right-4 text-6xl text-slate-50 opacity-50"></i>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6">Verlauf (Letzte 7 Tage)</h3>
          <div class="relative w-full h-64">
            <Bar :data="weeklyChartData" :options="barChartOptions" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="md:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-6 w-full text-left">Makro-Ratio</h3>
            <div class="relative w-full aspect-square max-w-[220px]">
              <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
            </div>
          </div>

          <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-6">Gesamtwerte (All Time)</h3>

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
                  <span class="text-emerald-500">{{ totalMacros.carbs.toFixed(0) }}g</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500" :style="{ width: getPercentage('carbs') + '%' }"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm font-bold mb-2">
                  <span class="text-slate-600">Fett</span>
                  <span class="text-rose-500">{{ totalMacros.fat.toFixed(0) }}g</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-rose-500" :style="{ width: getPercentage('fat') + '%' }"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Doughnut, Bar },
  data() {
    return {
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      foodEntries: [],
      isLoading: true,

      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'sans-serif', size: 11 } } }
        }
      },


      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 10 }, color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: 'bold' }, color: '#64748b' }
          }
        }
      }
    }
  },
  computed: {
    // 1. Alle Werte zusammenzählen
    totalMacros() {
      return this.foodEntries.reduce((acc, item) => {
        acc.protein += item.protein || 0;
        acc.carbs += item.carbohydrates || 0;
        acc.fat += item.fat || 0;
        acc.calories += item.calories || 0;
        return acc;
      }, { protein: 0, carbs: 0, fat: 0, calories: 0 });
    },

    // 2. Anzahl der einzigartigen Tage ermitteln (für den Durchschnitt)
    uniqueDaysCount() {
      if (this.foodEntries.length === 0) return 0;
      const dates = this.foodEntries.map(entry => entry.date || entry.createdAt?.split('T')[0] || 'unknown');
      const unique = new Set(dates);
      return unique.size || 1;
    },

    averageDailyCalories() {
      if (this.uniqueDaysCount === 0) return 0;
      return (this.totalMacros.calories / this.uniqueDaysCount).toFixed(0);
    },

    averageDailyProtein() {
      if (this.uniqueDaysCount === 0) return 0;
      return (this.totalMacros.protein / this.uniqueDaysCount).toFixed(0);
    },

    // DATEN FÜR KREISDIAGRAMM (All Time)
    doughnutChartData() {
      return {
        labels: ['Protein', 'Carbs', 'Fett'],
        datasets: [{
          backgroundColor: ['#4f46e5', '#10b981', '#f43f5e'], // Indigo, Emerald, Rose
          borderWidth: 0,
          data: [this.totalMacros.protein, this.totalMacros.carbs, this.totalMacros.fat]
        }]
      }
    },

    // DATEN FÜR WOCHEN-DIAGRAMM (Letzte 7 Tage)
    weeklyChartData() {
      const last7Days = [];
      const dataPoints = [];

      // Schleife für die letzten 7 Tage (von heute rückwärts)
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        // Label: Wochentag (z.B. "Mo")
        const label = d.toLocaleDateString('de-DE', { weekday: 'short' });
        // Datumstring zum Vergleich: "2024-01-12"
        const dateStr = d.toISOString().split('T')[0];

        last7Days.push(label);

        // Summiere alle Kalorien, die an diesem Datum ("date" vom Backend) gegessen wurden
        const dailySum = this.foodEntries
            .filter(entry => entry.date === dateStr)
            .reduce((sum, e) => sum + (e.calories || 0), 0);

        dataPoints.push(dailySum);
      }

      return {
        labels: last7Days,
        datasets: [{
          label: 'Kalorien',
          backgroundColor: '#4f46e5',
          borderRadius: 6,
          data: dataPoints
        }]
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

    // AUTH HEADER BAUEN
    getAuthHeaders() {
      const token = localStorage.getItem('jwt_token');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    },

    // ECHTE DATEN LADEN
    async fetchData() {
      this.isLoading = true;
      try {
        const response = await fetch(this.BASE_API_URL, {
          headers: this.getAuthHeaders()
        });

        // Falls Token abgelaufen -> Rauswerfen
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('jwt_token');
          this.$router.push('/login');
          return;
        }

        if (response.ok) {
          this.foodEntries = await response.json();
          // Debugging: Zeige in der Konsole, was ankam (um Datumsfeld zu prüfen)
          console.log("Geladene Einträge:", this.foodEntries);
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