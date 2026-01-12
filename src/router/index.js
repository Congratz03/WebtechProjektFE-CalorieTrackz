import { createRouter, createWebHistory } from 'vue-router'
import TrackerView from '../views/TrackerView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'tracker',
            component: TrackerView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ]
})

export default router
