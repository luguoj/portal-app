import {computed, inject, provide} from "vue";
import {useAppContext} from "./PsrAppContextProvider";
import {ComputedRef} from "vue";

const KEY = 'psr-app-context-layout-store-proxy'


interface LayoutStoreProxy<S> {
    state: S,
    commit: (mutation: string, payload?: any) => void,
    dispatch: (action: string, payload?: any) => Promise<any>
}

export function createLayoutStoreProxy<S>() {
    const appContext = useAppContext()
    const store = appContext.store.store
    const layoutStore = computed<LayoutStoreProxy<S> | null>(() => {
        const layoutName = appContext.router.current.value?.layout?.name
        if (layoutName) {
            return {
                state: store.state[layoutName] as S,
                commit: function (mutation: string, payload?: any) {
                    store.commit(`${layoutName}/${mutation}`, payload)
                },
                dispatch: function (action: string, payload?: any) {
                    return store.dispatch(`${layoutName}/${action}`, payload)
                }
            }
        } else {
            return null
        }
    })
    provide(KEY, layoutStore)
    return layoutStore
}

export function useLayoutStoreProxy<S>() {
    return inject<ComputedRef<LayoutStoreProxy<S>>>(KEY)
}