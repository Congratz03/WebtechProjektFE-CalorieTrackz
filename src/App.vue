<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('jwt_token')
}

watch(route, () => {
  checkLoginStatus()
})

const handleLogout = () => {
  localStorage.removeItem('jwt_token')
  isLoggedIn.value = false
  router.push('/login')
}

checkLoginStatus()
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">

    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between relative">

          <div
              class="flex-shrink-0 cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
              @click="router.push(isLoggedIn ? '/tracker' : '/login')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-indigo-600">
              <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>

            <div class="text-2xl font-black tracking-tighter text-indigo-600">
              CALORIE<span class="text-slate-800">TRACKZ</span>
            </div>
          </div>

          <div v-if="isLoggedIn" class="absolute left-1/2 transform -translate-x-1/2 flex gap-8 h-full items-center">
            <RouterLink
                to="/tracker"
                class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors h-full flex items-center border-b-2 border-transparent"
                active-class="!text-indigo-600 !border-indigo-600"
            >
              TRACKER
            </RouterLink>

            <RouterLink
                to="/analyse"
                class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors h-full flex items-center border-b-2 border-transparent"
                active-class="!text-indigo-600 !border-indigo-600"
            >
              ANALYSE
            </RouterLink>

            <RouterLink
                to="/profil"
                class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors h-full flex items-center border-b-2 border-transparent"
                active-class="!text-indigo-600 !border-indigo-600"
            >
              PROFIL
            </RouterLink>
          </div>

          <div class="flex items-center gap-4">
            <button
                v-if="isLoggedIn"
                @click="handleLogout"
                class="text-sm font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-lg transition-all"
            >
              LOGOUT
            </button>

            <RouterLink
                v-if="!isLoggedIn"
                to="/login"
                class="text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              LOGIN
            </RouterLink>
          </div>

        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto p-4 py-8">
      <RouterView />
    </div>

  </div>
</template>