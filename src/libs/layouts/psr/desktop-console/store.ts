import {Module} from "vuex";

export interface PsrLayoutDesktopConsoleState {
    asideCollapsed: boolean
    tagBarCollapsed: boolean
    defaultNavigationRoute: string
}

export const store: Module<PsrLayoutDesktopConsoleState, any> = {
    namespaced: true,
    state() {
        return {
            asideCollapsed: false,
            tagBarCollapsed: false,
            defaultNavigationRoute: ''
        }
    },
    mutations: {
        toggleAside(state) {
            state.asideCollapsed = !state.asideCollapsed
        },
        toggleTagBar(state) {
            state.tagBarCollapsed = !state.tagBarCollapsed
        },
        updateDefaultNavigationRoute(state, navigationRoute: string) {
            state.defaultNavigationRoute = navigationRoute
        }
    }
}