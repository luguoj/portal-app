import {createStore} from "vuex"
import {createPersistedState} from "@/modules/vuexPlugins/persist";
import desktop from "@/store/desktop";

const options = {
    state() {
        return {
            username: ''
        }
    },
    actions: {},
    mutations: {
        signOut(state) {
            state.username = null
        },
        signIn(state, username) {
            state.username = username
        },
    },
    modules: {
        desktop
    }
}

export const store = createStore({
    ...options,
    plugins: [
        createPersistedState()
    ]
})

export function resetStore() {
    store.replaceState(createStore(options).state)
}