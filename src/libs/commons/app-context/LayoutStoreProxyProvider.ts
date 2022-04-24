import {RouteLocationNormalized} from "vue-router";
import {computed, inject, provide, ref} from "vue";
import {useAppContext} from "./PsrAppContextProvider";
import {ComputedRef} from "@vue/reactivity";

const KEY = 'psr-app-context-layout-store-proxy'


interface LayoutStoreProxy<S> {
    state: S,
    commit: (mutation: string, payload?: any) => void,
    dispatch: (action: string, payload?: any) => Promise<any>
}

export function updateLayoutStoreModuleName(to: RouteLocationNormalized, vm: any) {
    if (to.matched.length > 0) {
        vm.layoutStoreModuleName = to.matched[0].name
    } else {
        vm.layoutStoreModuleName = null
    }
}

export function createLayoutStoreProxy<S>() {
    const {store: {store}} = useAppContext()
    const layoutStoreModuleName = ref<string | null>(null)
    const layoutStore = computed<LayoutStoreProxy<S> | null>(() => {
        if (layoutStoreModuleName.value) {
            return {
                state: store.state[layoutStoreModuleName.value] as S,
                commit: function (mutation: string, payload?: any) {
                    store.commit(`${layoutStoreModuleName.value}/${mutation}`, payload)
                },
                dispatch: function (action: string, payload?: any) {
                    return store.dispatch(`${layoutStoreModuleName.value}/${action}`, payload)
                }
            }
        } else {
            return null
        }
    })
    provide(KEY, layoutStore)
    return {
        layoutStore,
        layoutStoreModuleName
    }
}

export function useLayoutStoreProxy<S>() {
    return inject<ComputedRef<LayoutStoreProxy<S>>>(KEY)
}