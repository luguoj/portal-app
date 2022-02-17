import {createApp} from 'vue'
import App from './App.vue'
import {store} from "@/store"
import {router} from "@/router";

import './styles/global.css'

const app = createApp(App)
app.use(store)
app.use(router)

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

app.use(ElementPlus, {locale: zhCn})

app.mount('#app')
