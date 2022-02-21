import {createApp} from 'vue'
import App from './App.vue'
import {store} from "@/store"
import {router} from "@/router";

import './styles/global.css'
import {usePrimeVue} from "@/component-libs/PrimeVue";
import {useElementPlus} from "@/component-libs/ElementPlus";

const app = createApp(App)
app.use(store)
app.use(router)
usePrimeVue(app)
useElementPlus(app)

app.mount('#app')
