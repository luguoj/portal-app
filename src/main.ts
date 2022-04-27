import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import {applyPlugins} from "@/plugin-config/applyPlugins";

const app = createApp(App)
applyPlugins(app)
app.mount('#app')
