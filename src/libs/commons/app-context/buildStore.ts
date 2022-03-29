import {ModuleConfig} from "./ModuleConfig";
import {StoreRootMutations, StoreRootState, StoreRootStateDefaultValue} from "./StoreRootState";
import {createStore, ModuleTree, Plugin, StoreOptions} from "vuex";

export function buildStoreOptions(moduleConfigs: ModuleConfig[]): StoreOptions<StoreRootState> {
    const modules: ModuleTree<any> = {}
    for (const module of moduleConfigs) {
        if (module.store) {
            modules[module.name] = module.store
        }
    }
    return {
        state: StoreRootStateDefaultValue(),
        getters: {},
        mutations: StoreRootMutations,
        actions: {},
        modules
    }
}

export function buildStore(moduleConfigs: ModuleConfig[], storePlugins?: Plugin<any>[]) {
    const storeOptions = buildStoreOptions(moduleConfigs);
    storeOptions.plugins = storePlugins
    return createStore(storeOptions)
}