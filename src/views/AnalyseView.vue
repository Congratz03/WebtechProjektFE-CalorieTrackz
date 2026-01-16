<template>
  <div class="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

    <header class="max-w-5xl mx-auto px-6 mb-8 pt-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Deine Analyse</h1>
      <p class="text-slate-400 font-medium">Die Daten basierend auf deinem Profil und Einträgen.</p>
    </header>

    <main class="max-w-5xl mx-auto px-6 pb-20">

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium">Synchronisiere mit Datenbank...</p>
      </div>

      <div v-else-if="foodEntries.length === 0" class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
        <i class="fa-solid fa-chart-pie text-slate-200 text-4xl mb-4"></i>
        <p class="text-slate-400 font-medium">Noch keine Daten für eine Analyse vorhanden.</p>
        <router-link to="/tracker" class="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors">
          Zum Tracker
        </router-link>
      </div>

      <div v-else class="space-y-6">

        <div class="mb-2">

          <div v-if="userGoal === 'LOSE_WEIGHT'" class="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-[2rem] border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold text-emerald-900 mb-1">Deine Wochenbilanz</h3>
              <p class="text-sm text-emerald-600 font-medium">Dein Fokus: Kaloriendefizit halten.</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Gesamt Eingespart</p>
              <p class="text-4xl font-black" :class="weeklyDeficit >= 0 ? 'text-emerald-600' : 'text-rose-500'">
                {{ weeklyDeficit > 0 ? '-' : '+' }}{{ Math.abs(weeklyDeficit) }} <span class="text-lg font-medium opacity-60">kcal</span>
              </p>
            </div>
          </div>

          <div v-else-if="userGoal === 'BUILD_MUSCLE'" class="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-[2rem] border border-amber-100">
            <div class="flex justify-between items-end mb-4">
              <div>
                <h3 class="text-xl font-bold text-amber-900 mb-1">Protein Check</h3>
                <p class="text-sm text-amber-600 font-medium">Ziel: {{ proteinGoal }}g pro Tag für den Aufbau.</p>
              </div>
              <span class="text-3xl font-black text-amber-600">{{ averageDailyProtein }}g <span class="text-sm font-normal text-amber-400">/ {{ proteinGoal }}g</span></span>
            </div>
            <div class="h-4 w-full bg-white rounded-full overflow-hidden border border-amber-100 relative">
              <div class="h-full bg-amber-500 transition-all duration-1000" :style="{ width: Math.min(proteinPercentage, 100) + '%' }"></div>
            </div>
          </div>

          <div v-else class="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Gewicht halten</h3>
              <p class="text-sm text-slate-400">Versuche nah an deinem Tagesbedarf zu bleiben.</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold uppercase text-slate-400 mb-1">Ziel</p>
              <p class="text-2xl font-black text-slate-800">{{ targetCalories.toFixed(0) }} kcal</p>
            </div>
          </div>
        </div>

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
              <p class="text-4xl font-light text-amber-600">
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
          <h3 class="text-lg font-bold text-slate-800 mb-6">Verlauf (Kalorien der letzte 7 Tage)</h3>
          <div class="relative w-full h-64">
            <!-- HIER GEÄNDERT: 'Chart' Komponente statt 'Bar' für gemischte Charts -->
            <Chart type="bar" :data="weeklyChartData" :options="barChartOptions" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div class="md:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-6 w-full text-left">Makro-Ratio</h3>
            <div class="relative w-full aspect-square max-w-[220px]">
              <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
            </div>
          </div>

          <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-6">Deine "Top 3" Kalorien-Quellen</h3>
            <div class="space-y-4">
              <div
                  v-for="(food, index) in topFoods"
                  :key="index"
                  class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0"
              >
                <div class="flex items-center gap-4">
                  <div class="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">{{ index + 1 }}</div>
                  <div>
                    <p class="font-bold text-slate-800 text-sm">{{ food.name }}</p>
                    <p class="text-[10px] text-slate-400">{{ food.date || 'Kein Datum' }}</p>
                  </div>
                </div>
                <span class="font-bold text-indigo-600 text-sm">{{ food.calories }} kcal</span>
              </div>

              <div v-if="topFoods.length === 0" class="text-center text-slate-400 text-sm py-4">
                Noch nicht genügend Daten.
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
// CHART.JS SETUP
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'
// HIER GEÄNDERT: Wir importieren die generische 'Chart' Komponente
import { Doughnut, Chart } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

export default {
  // HIER GEÄNDERT: 'Chart' registrieren
  components: { Doughnut, Chart },
  data() {
    return {
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      USER_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/users/me',

      foodEntries: [],
      isLoading: true,

      userGoal: 'LOSE_WEIGHT',
      targetCalories: 2000,
      userWeight: 80,

      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'sans-serif', size: 11 } } } }
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' }, color: '#64748b' } }
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

    uniqueDaysCount() {
      if (this.foodEntries.length === 0) return 0;
      const dates = this.foodEntries.map(entry => entry.date || entry.createdAt?.split('T')[0] || 'unknown');
      return new Set(dates).size || 1;
    },

    averageDailyCalories() {
      if (this.uniqueDaysCount === 0) return 0;
      return (this.totalMacros.calories / this.uniqueDaysCount).toFixed(0);
    },
    averageDailyProtein() {
      if (this.uniqueDaysCount === 0) return 0;
      return (this.totalMacros.protein / this.uniqueDaysCount).toFixed(0);
    },

    proteinGoal() {
      const multiplier = this.userGoal === 'BUILD_MUSCLE' ? 2.0 : 1.5;
      return (this.userWeight * multiplier).toFixed(0);
    },
    proteinPercentage() {
      const goal = parseFloat(this.proteinGoal);
      if (!goal || goal === 0) return 0;
      return (this.averageDailyProtein / goal) * 100;
    },

    weeklyDeficit() {
      if (this.uniqueDaysCount === 0) return 0;
      const totalTarget = this.targetCalories * this.uniqueDaysCount;
      const totalConsumed = this.totalMacros.calories;
      return (totalTarget - totalConsumed).toFixed(0);
    },

    topFoods() {
      return [...this.foodEntries]
          .sort((a, b) => (b.calories || 0) - (a.calories || 0))
          .slice(0, 3);
    },

    weeklyChartData() {
      const last7Days = [];
      const dataPoints = [];
      const goalPoints = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('de-DE', { weekday: 'short' });
        const dateStr = d.toISOString().split('T')[0];

        last7Days.push(label);

        const dailySum = this.foodEntries
            .filter(entry => entry.date === dateStr)
            .reduce((sum, e) => sum + (e.calories || 0), 0);

        dataPoints.push(dailySum);
        goalPoints.push(this.targetCalories);
      }

      return {
        labels: last7Days,
        datasets: [
          {
            type: 'bar',
            label: 'Kalorien',
            backgroundColor: '#4f46e5',
            borderRadius: 6,
            data: dataPoints,
            order: 2
          },
          {
            type: 'line',
            label: 'Ziel',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            data: goalPoints,
            order: 1
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('jwt_token');
      return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    },

    async fetchData() {
      this.isLoading = true;
      try {
        await this.fetchUserData();
        const response = await fetch(this.BASE_API_URL, { headers: this.getAuthHeaders() });

        if (response && (response.status === 403 || response.status === 401)) {
          localStorage.removeItem('jwt_token');
          this.$router.push('/login');
          return;
        }

        if (response.ok) {
          this.foodEntries = await response.json();
        }
      } catch (e) {
        console.error("Fehler beim Laden:", e);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserData() {
      try {
        const response = await fetch(this.USER_API_URL, { headers: this.getAuthHeaders() });
        if (response.ok) {
          const data = await response.json();
          this.userGoal = data.goal;
          this.targetCalories = data.targetCalories;
          this.userWeight = data.currentWeight;
        }
      } catch (e) {
        console.error("User Profil konnte nicht geladen werden", e);
      }
    }
  }
}
</script>
