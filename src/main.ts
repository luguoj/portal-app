import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store'

import './styles/global.css'
import {usePrimeVue} from "./component-libs/PrimeVue"
import {useElementPlus} from "./component-libs/ElementPlus"
import {navigationMenu} from "@/navigation-menu";

const app = createApp(App).use(store).use(router).use(navigationMenu)
useElementPlus(app)
usePrimeVue(app)
app.mount('#app')
