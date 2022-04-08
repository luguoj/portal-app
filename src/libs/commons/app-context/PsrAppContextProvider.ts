import {PsrAppContext} from "./PsrAppContext";
import {inject} from "vue";
import {PsrAppContextOptions} from "./types/PsrAppContextOptions";

const APP_CONTEXT_KEY = 'psr-app-context'

export function useAppContext() {
    return inject(APP_CONTEXT_KEY) as PsrAppContext
}

export function createAppContext(options: PsrAppContextOptions) {
    return new PsrAppContext(APP_CONTEXT_KEY, options)
}
