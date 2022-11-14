import {App} from "@vue/runtime-core";
import {applyElementPlus} from "./element-plus";
import {applyPrimeVue} from "./prime-vue";
import {applyPsrAppContext} from "@/config/psr-app-context";
import '@/libs/components/psr/styles/global.css'
import {applyDataProvider} from "@/libs/components/psr/widgets/dashboard/services/DataProvider";
import {dataProviders} from "@/config/data-provider";

export function applyPlugins(app: App) {
    applyElementPlus(app)
    applyPrimeVue(app)
    applyPsrAppContext(app)
    applyDataProvider(app, dataProviders)
}