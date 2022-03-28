import {inject, provide, reactive} from "vue";
import {CachedRoute} from "@/libs/components/psr-layout/views/PsrLayout.vue";
import {UnwrapNestedRefs} from "@vue/reactivity";

const CACHED_ROUTES_KEY = 'cachedRoutes'

export function provideCachedRoutes() {
    provide(CACHED_ROUTES_KEY, reactive([] as CachedRoute[]))
}

export function useCachedRoutes() {
    return inject(CACHED_ROUTES_KEY) as UnwrapNestedRefs<CachedRoute[]>
}