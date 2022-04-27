import {inject} from "vue";
import {PsrAppPlugin} from "./types/PsrAppPlugin";

export function usePlugin<T extends PsrAppPlugin>(injectKey: string) {
    const plugin = inject(injectKey) as T
    if (plugin == null) {
        throw new Error(`plugin is missing: ${injectKey}`)
    }
    return plugin
}