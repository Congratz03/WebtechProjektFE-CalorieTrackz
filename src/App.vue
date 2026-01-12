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
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex justify-between h-16 items-center">

          <div class="text-xl font-black tracking-tighter text-indigo-600">
            CALORIE<span class="text-slate-800">TRACKZ</span>
          </div>

          <div class="flex gap-6 text-sm font-bold">

            <RouterLink
                v-if="!isLoggedIn"
                to="/login"
                class="text-slate-500 hover:text-indigo-600 transition-colors"
                active-class="text-indigo-600"
            >
              LOGIN
            </RouterLink>

            <RouterLink
                v-if="isLoggedIn"
                to="/tracker"
                class="text-slate-500 hover:text-indigo-600 transition-colors"
                active-class="text-indigo-600"
            >
              TRACKER
            </RouterLink>

            <button
                v-if="isLoggedIn"
                @click="handleLogout"
                class="text-rose-500 hover:text-rose-700 transition-colors uppercase"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto p-4 py-8">
      <RouterView />
    </div>

  </div>
</template>