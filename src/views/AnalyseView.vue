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

        <!-- KPIs -->
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
          <!-- Andere Goal-Cards hier (aus Platzgründen gekürzt, funktionieren aber wie gehabt) -->
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

        <!-- 3 Kleine KPI Karten -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Ø Tägl. Kalorien</p>
              <p class="text-4xl font-light text-indigo-600">{{ averageDailyCalories }}</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Ø Tägl. Protein</p>
              <p class="text-4xl font-light text-amber-600">{{ averageDailyProtein }}</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Aktive Tage</p>
              <p class="text-4xl font-light text-slate-900">{{ uniqueDaysCount }}</p>
            </div>
          </div>
        </div>

        <!-- MAIN CHART -->
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 class="text-lg font-bold text-slate-800 mb-6">Verlauf (Kalorien der letzte 7 Tage)</h3>
          <div class="relative w-full h-64">
            <!-- WICHTIG: Hier wieder <Bar> benutzen -->
            <Bar :data="weeklyChartData" :options="barChartOptions" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- DOUGHNUT CHART -->
          <div class="md:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 class="text-lg font-bold text-slate-800 mb-6 w-full text-left">Makro-Ratio</h3>
            <div class="relative w-full aspect-square max-w-[220px]">
              <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
            </div>
          </div>

          <!-- LISTE -->
          <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-6">Top 3 Kalorien-Quellen</h3>
            <div class="space-y-4">
              <div v-for="(food, index) in topFoods" :key="index" class="flex items-center justify-between p-3 border-b border-slate-50">
                <div class="flex items-center gap-4">
                  <div class="font-bold text-indigo-600">{{ index + 1 }}</div>
                  <p class="font-bold text-slate-800 text-sm">{{ food.name }}</p>
                </div>
                <span class="font-bold text-indigo-600 text-sm">{{ food.calories }} kcal</span>
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
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController, // WICHTIG: Controller für Linien explizit importieren
  BarController,   // WICHTIG: Controller für Balken explizit importieren
  ArcElement
} from 'chart.js'

// Vue Components
import { Bar, Doughnut } from 'vue-chartjs'

// Alles registrieren
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController, // <-- Damit ChartJS weiß wie man Linien malt
    BarController,   // <-- Damit ChartJS weiß wie man Balken malt
    ArcElement
)

export default {
  components: {Bar, Doughnut},
  data() {
    return {
      BASE_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/foods',
      USER_API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/users/me',

      foodEntries: [],
      isLoading: true,

      userGoal: 'LOSE_WEIGHT',
      targetCalories: 2000,
      userWeight: 80,

      // Doughnut Options
      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {legend: {position: 'bottom'}}
      },

      // Bar Chart Options (angepasst für Mixed Mode)
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {display: true, position: 'top'}}, // Legende anzeigen damit man "Ziel" sieht
        scales: {
          y: {beginAtZero: true},
          x: {grid: {display: false}}
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
      }, {protein: 0, carbs: 0, fat: 0, calories: 0});
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
    doughnutChartData() {
      return {
        labels: ['Protein', 'Carbs', 'Fett'],
        datasets: [{
          backgroundColor: ['#f59e0b', '#10b981', '#f43f5e'],
          borderWidth: 0,
          data: [this.totalMacros.protein, this.totalMacros.carbs, this.totalMacros.fat]
        }]
      }
    },
    weeklyChartData() {
      const last7Days = [];
      const dataPoints = [];
      const goalPoints = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('de-DE', {weekday: 'short'});
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
            type: 'bar', // Explizit Typ angeben
            label: 'Kalorien',
            backgroundColor: '#4f46e5',
            borderRadius: 6,
            data: dataPoints,
            order: 2
          },
          {
            type: 'line', // Explizit Typ angeben
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
      return {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`};
    },
    async fetchData() {
      this.isLoading = true;
      try {
        await this.fetchUserData();
        const response = await fetch(this.BASE_API_URL, {headers: this.getAuthHeaders()});
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
        const response = await fetch(this.USER_API_URL, {headers: this.getAuthHeaders()});
        if (response.ok) {
          const data = await response.json();
          this.userGoal = data.goal;
          this.targetCalories = data.targetCalories;
          this.userWeight = data.currentWeight;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
