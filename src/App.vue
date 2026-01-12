<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F9FAFB]">

    <!-- Globale Navigation -->
    <nav class="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-50 flex items-center px-6 md:px-12 justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
          <i class="fa-solid fa-bolt text-white text-xs"></i>
        </div>
        <span class="text-xl font-bold tracking-tight text-slate-800">Calorie<span class="text-indigo-600">Trackz</span></span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center space-x-10 text-[13px] uppercase tracking-[0.15em] font-bold text-slate-400">

        <RouterLink to="/" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600 border-b-2 border-indigo-600 pb-1">
          Tracker
        </RouterLink>

        <RouterLink to="/analyse" class="hover:text-slate-900 transition-colors">
          Analyse
        </RouterLink>

        <RouterLink to="/login" class="hover:text-indigo-600 transition-colors" active-class="text-indigo-600 border-b-2 border-indigo-600 pb-1">
          Login / Profil
        </RouterLink>
      </div>
      <!-- Platzhalter für User-Icon oder Logout später -->
      <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <i class="fa-solid fa-user"></i>
      </div>
    </nav>

    <div class="pt-20">
      <RouterView />
    </div>

  </div>
</template>
