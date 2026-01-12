import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // Dein Tailwind CSS Import (Name evtl. anpassen, wenn er anders heißt)

const app = createApp(App)

app.use(router)

app.mount('#app')
