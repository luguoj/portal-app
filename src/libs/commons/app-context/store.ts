import {createStore, ModuleTree, Plugin, StoreOptions} from "vuex";

export interface StoreRootState {
    username: string,
    userLastRoutePath: string
}

export function buildStoreOptions(storeModules: ModuleTree<any>): StoreOptions<StoreRootState> {
    return {
        state: () => {
            return {
                username: '',
                userLastRoutePath: '/'
            }
        },
        getters: {},
        mutations: {
            updateUsername(state, username) {
                state.username = username
            },
            updateUserLastRoutePath(state, value) {
                state.userLastRoutePath = value
            }
        },
        actions: {},
        modules: storeModules
    }
}

export function buildStore(storeModules: ModuleTree<any>, storePlugins?: Plugin<any>[]) {
    const storeOptions = buildStoreOptions(storeModules);
    storeOptions.plugins = storePlugins
    return createStore(storeOptions)
}