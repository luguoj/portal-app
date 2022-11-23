import {App} from "vue";
import {applyElementPlus} from "./element-plus";
import {applyPrimeVue} from "./prime-vue";
import {applyPsrAppContext} from "@/config/psr-app-context";
import '@/libs/components/psr/styles/global.css'
import {applyDataProvider} from "@psr-framework/vue3-plugin-dashboard";
import {dataProviders} from "@/config/data-provider";

export function applyPlugins(app: App) {
    applyElementPlus(app)
    applyPrimeVue(app)
    applyPsrAppContext(app)
    applyDataProvider(app, dataProviders)
}