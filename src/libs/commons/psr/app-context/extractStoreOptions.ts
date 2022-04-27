import {PsrAppLayoutOptions} from "./types/PsrAppLayoutOptions";
import {ModuleTree} from "vuex";

export function extractStoreOptions(layouts: PsrAppLayoutOptions[]) {
    const stores: ModuleTree<any> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        // 布局状态
        if (layout.store) {
            stores[layout.name] = layout.store
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.store) {
                    stores[module.name] = module.store
                }
            }
        }
    }
    return stores
}