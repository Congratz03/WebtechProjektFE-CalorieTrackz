<template>
  <div class="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

    <header class="max-w-4xl mx-auto px-6 mb-8 pt-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Dein Profil</h1>
      <p class="text-slate-400 font-medium">Passe deine körperlichen Daten und Ziele an.</p>
    </header>

    <main class="max-w-4xl mx-auto px-6 pb-20">

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div class="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <form @submit.prevent="saveProfile">

            <h3 class="text-lg font-bold text-slate-800 mb-6">Körperdaten</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Gewicht (kg)</label>
                <input type="number" step="0.1" v-model="user.weight" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Größe (cm)</label>
                <input type="number" v-model="user.height" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Alter</label>
                <input type="number" v-model="user.age" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Geschlecht</label>
                <select v-model="user.gender" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                  <option value="MALE">Männlich</option>
                  <option value="FEMALE">Weiblich</option>
                </select>
              </div>
            </div>

            <hr class="border-slate-100 my-8">

            <h3 class="text-lg font-bold text-slate-800 mb-6">Ziele & Aktivität</h3>

            <div class="space-y-6">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Dein Ziel</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label class="cursor-pointer">
                    <input type="radio" value="LOSE_WEIGHT" v-model="user.goal" class="hidden peer">
                    <div class="border-2 border-slate-100 rounded-xl p-4 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all">
                      <i class="fa-solid fa-arrow-trend-down mb-2 text-xl" :class="user.goal === 'LOSE_WEIGHT' ? 'text-emerald-600' : 'text-slate-300'"></i>
                      <div class="text-sm font-bold text-slate-700">Abnehmen</div>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" value="MAINTAIN_WEIGHT" v-model="user.goal" class="hidden peer">
                    <div class="border-2 border-slate-100 rounded-xl p-4 text-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all">
                      <i class="fa-solid fa-scale-balanced mb-2 text-xl" :class="user.goal === 'MAINTAIN_WEIGHT' ? 'text-indigo-600' : 'text-slate-300'"></i>
                      <div class="text-sm font-bold text-slate-700">Halten</div>
                    </div>
                  </label>

                  <label class="cursor-pointer">
                    <input type="radio" value="BUILD_MUSCLE" v-model="user.goal" class="hidden peer">
                    <div class="border-2 border-slate-100 rounded-xl p-4 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                      <i class="fa-solid fa-dumbbell mb-2 text-xl" :class="user.goal === 'BUILD_MUSCLE' ? 'text-blue-600' : 'text-slate-300'"></i>
                      <div class="text-sm font-bold text-slate-700">Aufbau</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase text-slate-400 mb-2">Aktivitätslevel</label>
                <select v-model="user.activityLevel" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                  <option value="LOW">Wenig Bewegung (Bürojob)</option>
                  <option value="MODERATE">Moderat (1-3x Sport/Woche)</option>
                  <option value="HIGH">Sehr Aktiv (4-6x Sport/Woche)</option>
                </select>
              </div>
            </div>

            <div class="mt-8 flex items-center justify-between">
              <p v-if="successMessage" class="text-emerald-600 text-sm font-bold animate-pulse">
                <i class="fa-solid fa-check mr-1"></i> {{ successMessage }}
              </p>
              <div v-else></div> <button type="submit" :disabled="isSaving"
                                         class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50">
              <span v-if="isSaving"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Speichern...</span>
              <span v-else>Änderungen speichern</span>
            </button>
            </div>

          </form>
        </div>

        <div class="space-y-6">

          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
            <p class="text-xs font-bold uppercase text-slate-400 mb-1">Dein BMI</p>
            <p class="text-4xl font-black text-slate-800">{{ calculatedBMI }}</p>
            <div class="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold"
                 :class="getBMICategory.color">
              {{ getBMICategory.text }}
            </div>
          </div>

          <div class="bg-indigo-600 p-6 rounded-[2rem] shadow-lg shadow-indigo-200 text-center text-white relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs font-bold uppercase text-indigo-200 mb-1">Neues Tagesziel</p>
              <p class="text-4xl font-black">{{ targetCalories || '---' }}</p>
              <p class="text-sm font-medium text-indigo-200">kcal / Tag</p>
            </div>
            <div class="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          </div>

          <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 text-sm text-slate-500 leading-relaxed">
            <p><i class="fa-solid fa-circle-info mr-2 text-indigo-500"></i>Dein Kalorienbedarf wird basierend auf der <strong>Mifflin-St. Jeor Formel</strong> berechnet und an dein gewähltes Ziel angepasst.</p>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      API_URL: 'https://webtechprojektbe-calorietrackz.onrender.com/api/users/me',
      isLoading: true,
      isSaving: false,
      successMessage: '',
      targetCalories: 0,

      // User Daten Modell
      user: {
        weight: 0,
        height: 0,
        age: 0,
        gender: 'MALE',
        activityLevel: 'LOW',
        goal: 'MAINTAIN_WEIGHT'
      }
    }
  },
  computed: {
    // Berechnet BMI Live im Frontend
    calculatedBMI() {
      if (!this.user.weight || !this.user.height) return 0;
      const heightInMeters = this.user.height / 100;
      return (this.user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    },

    // Gibt Farbe und Text für BMI zurück
    getBMICategory() {
      const bmi = parseFloat(this.calculatedBMI);
      if (bmi < 18.5) return { text: 'Untergewicht', color: 'bg-amber-100 text-amber-600' };
      if (bmi < 25) return { text: 'Normalgewicht', color: 'bg-emerald-100 text-emerald-600' };
      if (bmi < 30) return { text: 'Übergewicht', color: 'bg-orange-100 text-orange-600' };
      return { text: 'Adipositas', color: 'bg-rose-100 text-rose-600' };
    }
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('jwt_token');
      return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    },

    async fetchProfile() {
      this.isLoading = true;
      try {
        const response = await fetch(this.API_URL, { headers: this.getAuthHeaders() });
        if (response.status === 403) this.$router.push('/login');

        if (response.ok) {
          const data = await response.json();


          this.user.weight = data.currentWeight || data.weight; // Je nachdem wie  DTO heißt
          this.user.height = data.height || 175; // Fallback, falls nicht im DTO
          this.user.age = data.age || 25;       // Fallback
          this.user.gender = data.gender || 'MALE';
          this.user.activityLevel = data.activityLevel || 'LOW';
          this.user.goal = data.goal || 'MAINTAIN_WEIGHT';

          this.targetCalories = data.targetCalories;
        }
      } catch (e) {
        console.error("Fehler beim Laden", e);
      } finally {
        this.isLoading = false;
      }
    },

    async saveProfile() {
      this.isSaving = true;
      this.successMessage = '';

      try {
        // PUT Request senden
        const response = await fetch(this.API_URL, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(this.user)
        });

        if (response.ok) {
          const data = await response.json();
          this.targetCalories = data.targetCalories; // Update Kalorien
          this.successMessage = 'Profil erfolgreich aktualisiert!';

          // Nach 3 Sekunden Nachricht ausblenden
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          alert('Fehler beim Speichern.');
        }
      } catch (e) {
        console.error("Fehler beim Speichern", e);
      } finally {
        this.isSaving = false;
      }
    }
  }
}
</script>