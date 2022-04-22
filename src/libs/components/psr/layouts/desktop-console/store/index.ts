import {Module} from "vuex";
import {State} from "./State";

export const store: Module<State, any> = {
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