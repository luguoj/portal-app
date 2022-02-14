import {createApp} from "vue"
import {createStore} from "vuex"
import {createPersistedSatate} from "@/store/persistPlugin";

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