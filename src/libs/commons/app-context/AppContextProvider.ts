import {AppContext, AppContextOptions} from "./AppContext";
import {inject} from "vue";

const APP_CONTEXT_KEY = 'psr-app-context'

export function useAppContext() {
    return inject(APP_CONTEXT_KEY) as AppContext
}

export function createAppContext(options: AppContextOptions) {
    return new AppContext(APP_CONTEXT_KEY, options)
}
