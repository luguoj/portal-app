import {createStore, ModuleTree, StoreOptions} from 'vuex'
import {createStatePersistPlugin} from "@/libs/commons/store/plugins/state-persist";
import {State} from "@/store/State";
import {Modules} from "@/modules";


function options(): StoreOptions<State> {
    const modules: ModuleTree<any> = {}
    for (const module of Modules) {
        if (module.store) {
            modules[module.name] = module.store
        }
    }
    return {
        state: {
            username: '',
            userLastRoutePath: '/'
        },
        getters: {},
        mutations: {
            signOut(state) {
                state.username = ''
            },
            signIn(state, username) {
                state.username = username
            },
            updateUserLastRoutePath(state, value) {
                state.userLastRoutePath = value
            }
        },
        actions: {},
        modules
    }
}

export const store = createStore<State>({
    ...options(),
    plugins: [
        createStatePersistPlugin()
    ]
})

export function resetStore() {
    store.replaceState(createStore(options()).state)
}