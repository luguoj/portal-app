import {App} from "@vue/runtime-core";
import {applyElementPlus} from "./element-plus";
import {applyPrimeVue} from "./prime-vue";
import {applyPsrAppContext} from "@/config/psr-app-context";
import '@/libs/components/psr/styles/global.css'

export function applyPlugins(app: App) {
    applyElementPlus(app)
    applyPrimeVue(app)
    applyPsrAppContext(app)
}