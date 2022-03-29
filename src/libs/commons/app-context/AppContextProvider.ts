import {AppContext} from "./AppContext";
import {ModuleConfig} from "./ModuleConfig";
import {inject} from "vue";
import {Plugin} from "vuex";

const APP_CONTEXT_KEY = 'psr-app-context'

export function useAppContext() {
    return inject(APP_CONTEXT_KEY) as AppContext
}

export function createAppContext(options: AppContextOptions) {
    return new AppContext(options.modules, APP_CONTEXT_KEY, options.storePlugins)
}

export interface AppContextOptions {
    modules: ModuleConfig[]
    storePlugins?: Plugin<any>[]
}