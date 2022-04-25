import {onBeforeRouteLeave, RouteLocationNormalized} from "vue-router";
import {computed, inject, provide, ref} from "vue";
import {useAppContext} from "./PsrAppContextProvider";
import {ComputedRef} from "@vue/reactivity";

const KEY = 'psr-app-context-layout-store-proxy'


interface LayoutStoreProxy<S> {
    state: S,
    commit: (mutation: string, payload?: any) => void,
    dispatch: (action: string, payload?: any) => Promise<any>
}

export function onLayoutRouteEnter(to: RouteLocationNormalized, vm: any) {
    if (to.matched.length > 0) {
        vm.layoutName = to.matched[0].name
    } else {
        vm.layoutName = null
    }
}

export function createLayoutStoreProxy<S>() {
    const {store: {store}} = useAppContext()
    const layoutName = ref<string | null>(null)
    onBeforeRouteLeave(() => {
        console.log('LayoutStoreProxy.beForeRouteLeave=>清除layoutName')
        layoutName.value = null
    })
    const layoutStore = computed<LayoutStoreProxy<S> | null>(() => {
        if (layoutName.value) {
            return {
                state: store.state[layoutName.value] as S,
                commit: function (mutation: string, payload?: any) {
                    store.commit(`${layoutName.value}/${mutation}`, payload)
                },
                dispatch: function (action: string, payload?: any) {
                    return store.dispatch(`${layoutName.value}/${action}`, payload)
                }
            }
        } else {
            return null
        }
    })
    provide(KEY, layoutStore)
    return {
        layoutStore,
        layoutName
    }
}

export function useLayoutStoreProxy<S>() {
    return inject<ComputedRef<LayoutStoreProxy<S>>>(KEY)
}