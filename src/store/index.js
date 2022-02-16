import {createStore} from "vuex"
import {createPersistedSatate} from "@/modules/vuexPlugins/persist";

export const store = createStore({
    state() {
        return {}
    },
    actions: {},
    mutations: {},
    plugins: [
        createPersistedSatate()
    ]
})