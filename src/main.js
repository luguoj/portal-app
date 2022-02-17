import {createApp} from 'vue'
import App from './App.vue'
import {store} from "@/store"
import {router} from "@/router";

const app = createApp(App)
app.use(store)
app.use(router)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(ElementPlus)

app.mount('#app')
