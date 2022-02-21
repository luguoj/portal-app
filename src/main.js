import {createApp} from 'vue'
import App from './App.vue'
import {store} from "@/store"
import {router} from "@/router";

import './styles/global.css'

const app = createApp(App)
app.use(store)
app.use(router)

import PrimeVue from "primevue/config";
import 'primeicons/primeicons.css'

app.use(PrimeVue)

app.mount('#app')
