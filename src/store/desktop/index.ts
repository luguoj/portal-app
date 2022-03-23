import {Module} from "vuex";
import {DesktopState} from "@/store/desktop/State";
import {StoreState} from "@/store/State";

export const desktop: Module<DesktopState, StoreState> = {
    state: {
        asideCollapsed: false
    },
    mutations: {
        toggleAside(state) {
            state.asideCollapsed = !state.asideCollapsed
        }
    }
}