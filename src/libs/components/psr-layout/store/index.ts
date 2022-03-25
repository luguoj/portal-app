import {Module} from "vuex";
import {State} from "./State";

export const store: Module<State, any> = {
    namespaced: true,
    state: {
        asideCollapsed: false
    },
    mutations: {
        toggleAside(state) {
            state.asideCollapsed = !state.asideCollapsed
        }
    }
}