import {App} from "@vue/runtime-core";
import {applyElementPlus} from "./element-plus";
import {applyPrimeVue} from "./prime-vue";
import {applyPsrAppContext} from "@/plugin-config/psr-app-context";

export function applyPlugins(app: App) {
    applyElementPlus(app)
    applyPrimeVue(app)
    applyPsrAppContext(app)
}