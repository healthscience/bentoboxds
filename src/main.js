
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueDragscroll from 'vue-dragscroll'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // something vue-i18n options here ...
})

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueDragscroll)
app.use(i18n)

app.mount('#app')