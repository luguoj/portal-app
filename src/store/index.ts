import {createStore, StoreOptions} from 'vuex'
import {createStatePersistPlugin} from "@/modules/vuexPlugins/persist";
import {StoreState} from "@/store/State";
import {desktop} from "@/store/desktop";

const options: StoreOptions<StoreState> = {
    state: {
        username: ''
    },
    getters: {},
    mutations: {
        signOut(state) {
            state.username = ''
        },
        signIn(state, username) {
            state.username = username
        },
    },
    actions: {},
    modules: {
        desktop
    }
}
export const store = createStore<StoreState>({
    ...options,
    plugins: [
        createStatePersistPlugin()
    ]
})

export function resetStore() {
    store.replaceState(createStore(options).state)
}