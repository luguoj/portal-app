import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import './styles/global.css'
import {usePrimeVue} from "./component-libs/PrimeVue"
import {useElementPlus} from "./component-libs/ElementPlus"
import {appContext} from "@/appContext";

const app = createApp(App).use(appContext)
useElementPlus(app)
usePrimeVue(app)
app.mount('#app')
