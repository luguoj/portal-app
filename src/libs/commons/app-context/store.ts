import {createStore, ModuleTree, Plugin, StoreOptions} from "vuex";
import {PsrAppStoreRootState} from "@/libs/commons/app-context/store/types/PsrAppStoreRootState";

export function buildStoreOptions(storeModules: ModuleTree<any>): StoreOptions<PsrAppStoreRootState> {
    return {
        state() {
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