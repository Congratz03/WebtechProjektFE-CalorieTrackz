import { createRouter, createWebHistory } from 'vue-router'
import TrackerView from '../views/TrackerView.vue'
import LoginView from '../views/LoginView.vue'
import AnalyseView from '../views/AnalyseView.vue'
import ProfilView from '../views/ProfileView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresAuth: false }
        },
        {
            path: '/tracker',
            name: 'tracker',
            component: TrackerView,
            meta: { requiresAuth: true }
        },
        {
            path: '/analyse',
            name: 'analyse',
            component: AnalyseView,
            meta: { requiresAuth: true }
        },
        {
            path: '/profil',
            name: 'profil',
            component: ProfilView,
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt_token');

    if (to.meta.requiresAuth && !token) {
        next('/login');
    }
    else if (to.path === '/login' && token) {
        next('/tracker');
    }
    else {
        next();
    }
});

export default router