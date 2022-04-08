import {createStore, ModuleTree, Plugin, Store, StoreOptions} from "vuex";
import {PsrAppStoreRootState} from "./types/PsrAppStoreRootState";

export class PsrAppStore {
    private readonly _storeOptions: StoreOptions<PsrAppStoreRootState>
    readonly store: Store<PsrAppStoreRootState>

    constructor(storeModules: ModuleTree<any>, storePlugins?: Plugin<any>[]) {
        this._storeOptions = buildStoreOptions(storeModules)
        this.store = createStore({
            ...this._storeOptions,
            plugins: storePlugins
        })
    }

    resetStore() {
        this.store.replaceState(createStore(this._storeOptions).state)
    }
}

function buildStoreOptions(storeModules: ModuleTree<any>): StoreOptions<PsrAppStoreRootState> {
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