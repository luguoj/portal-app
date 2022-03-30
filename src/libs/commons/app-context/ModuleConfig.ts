import {Module, ModuleTree} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";
import {NavigationMenuItemRaw} from "./plugins/navigation-menu/NavigationMenuItemRaw";
import {RouteRecordRaw} from "vue-router";


export interface ModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>,
    menus?: NavigationMenuItemRaw[]
}

export function extractModuleConfigs(moduleConfigs: ModuleConfig[]) {
    const menus: NavigationMenuItemRaw[] = []
    const stores: ModuleTree<any> = {}
    const routes: RouteRecordRaw[] = []
    for (const module of moduleConfigs) {
        if (module.menus) {
            menus.push(...module.menus)
        }
        if (module.store) {
            stores[module.name] = module.store
        }
        if (module.routes) {
            routes.push(...module.routes)
        }
    }
    return {menus, stores, routes}
}


