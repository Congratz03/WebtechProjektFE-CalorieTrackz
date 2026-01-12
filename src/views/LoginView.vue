<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative">

      <!-- Umschalter Login / Registrieren -->
      <div class="flex border-b border-slate-100">
        <button
            @click="isRegistering = false"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
            :class="!isRegistering ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'"
        >
          Anmelden
        </button>
        <button
            @click="isRegistering = true"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
            :class="isRegistering ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'"
        >
          Registrieren
        </button>
      </div>

      <div class="p-8 pt-10">

        <!-- LOGIN FORMULAR -->
        <div v-if="!isRegistering">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 text-center">Willkommen zurück!</h2>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username</label>
              <input type="text" v-model="loginData.username" required
                     class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Passwort</label>
              <input type="password" v-model="loginData.password" required
                     class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors font-medium text-slate-700">
            </div>

            <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-4">
              Jetzt Anmelden
            </button>
          </form>
        </div>

        <!-- REGISTRIERUNGS FORMULAR (WIZARD) -->
        <div v-else>
          <h2 class="text-2xl font-bold text-slate-800 mb-2 text-center">Profil erstellen</h2>
          <p class="text-center text-slate-400 text-sm mb-6">Schritt {{ step }} von 2</p>

          <form @submit.prevent="handleRegister" class="space-y-4">

            <!-- SCHRITT 1: Account Daten -->
            <div v-if="step === 1" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wähle einen Usernamen</label>
                <input type="text" v-model="registerData.username" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium text-slate-700">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dein Passwort</label>
                <input type="password" v-model="registerData.password" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium text-slate-700">
              </div>

              <button type="button" @click="step = 2" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all mt-4">
                Weiter zu Schritt 2
              </button>
            </div>

            <!-- SCHRITT 2: Körperdaten -->
            <div v-if="step === 2" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alter</label>
                  <input type="number" v-model.number="registerData.age" required class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Geschlecht</label>
                  <select v-model="registerData.gender" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                    <option value="MALE">Männlich</option>
                    <option value="FEMALE">Weiblich</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gewicht (kg)</label>
                  <input type="number" v-model.number="registerData.weight" step="0.1" required class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Größe (cm)</label>
                  <input type="number" v-model.number="registerData.height" required class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aktivitätslevel</label>
                <select v-model="registerData.activityLevel" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                  <option value="LOW">Wenig (Bürojob)</option>
                  <option value="MODERATE">Mittel (1-3x Sport)</option>
                  <option value="HIGH">Hoch (Körperl. Arbeit / Viel Sport)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dein Ziel</label>
                <select v-model="registerData.goal" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 font-medium">
                  <option value="LOSE_WEIGHT">Abnehmen</option>
                  <option value="BUILD_MUSCLE">Muskeln aufbauen</option>
                </select>
              </div>

              <div class="flex gap-3 mt-6">
                <button type="button" @click="step = 1" class="flex-1 bg-gray-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">
                  Zurück
                </button>
                <button type="submit" class="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                  Profil erstellen
                </button>
              </div>
            </div>

          </form>
        </div>

        <!-- Fehlermeldung -->
        <p v-if="errorMessage" class="text-rose-500 text-sm font-bold text-center mt-6 bg-rose-50 py-2 rounded-lg">
          {{ errorMessage }}
        </p>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRegistering: false,
      step: 1,
      errorMessage: null,
      loginData: {
        username: '',
        password: ''
      },
      registerData: {
        username: '',
        password: '',
        age: 25,
        weight: 70,
        height: 175,
        gender: 'MALE',
        activityLevel: 'MODERATE',
        goal: 'LOSE_WEIGHT'
      }
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = null;
      console.log("Sende Login Request...", this.loginData);

      try {
        const response = await fetch('https://webtechprojektbe-calorietrackz.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginData)
        });

        if (!response.ok) {
          throw new Error('Login fehlgeschlagen. Benutzername oder Passwort falsch.');
        }

        const data = await response.json();
        const token = data.token;

        console.log("Login erfolgreich! Token:", token);
        localStorage.setItem('jwt_token', token);

        // Weiterleitung zum Tracker
        this.$router.push('/tracker');

      } catch (e) {
        console.error(e);
        this.errorMessage = e.message;
      }
    },
    async handleRegister() {
      this.errorMessage = null;
      try {
        const response = await fetch('https://webtechprojektbe-calorietrackz.onrender.com/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.registerData)
        });

        if (!response.ok) {
          throw new Error('Registrierung fehlgeschlagen (User existiert evtl. schon?)');
        }

        const data = await response.json();
        console.log("Registriert:", data);
        alert("Account erfolgreich erstellt! Bitte jetzt einloggen.");

        this.isRegistering = false;
        this.step = 1;
        // Optional: Username übernehmen für Komfort
        this.loginData.username = this.registerData.username;

      } catch (e) {
        this.errorMessage = e.message;
      }
    }
  }
}
</script>
