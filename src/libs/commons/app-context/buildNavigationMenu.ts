import {ModuleConfig} from "./ModuleConfig";
import {createNavigationMenu, NavigationMenuItemRaw} from "@/libs/commons/navigation-menu";

export function buildNavigationMenu(moduleConfigs: ModuleConfig[]) {
    const menus: NavigationMenuItemRaw[] = []
    for (const module of moduleConfigs) {
        if (module.menus) {
            menus.push(...module.menus)
        }
    }
    return createNavigationMenu({menus})
}