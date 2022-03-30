import {inject} from "vue";
import {AppPlugin} from "./AppPlugin";

export function usePlugin<T extends AppPlugin>(injectKey: string) {
    const plugin = inject(injectKey) as T
    if (plugin == null) {
        throw new Error(`plugin is missing: ${injectKey}`)
    }
    return plugin
}