import {createStore} from "vuex"
import {createPersistedSatate} from "@/modules/vuexPlugins/persist";
import desktop from "@/store/desktop";

export const store = createStore({
    state() {
        return {}
    },
    actions: {},
    mutations: {},
    modules: {
        desktop
    },
    plugins: [
        createPersistedSatate()
    ]
})