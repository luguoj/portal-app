import {App, inject} from "vue";
import {NavigationMenuItemRaw} from "@/libs/commons/navigation-menu/NavigationMenuItemRaw";
import {buildMenuItems} from "@/libs/commons/navigation-menu/buildMenuItems";
import {NavigationMenuItem} from "@/libs/commons/navigation-menu/NavigationMenuItem";

const KEY = 'psr-navigation-menu-items'

export function createNavigationMenu(
    options: {
        menus: NavigationMenuItemRaw[]
    }
) {
    return {
        install(app: App) {
            app.provide(KEY, buildMenuItems(options.menus))
        }
    }
}

export function useNavigationMenuItems(): NavigationMenuItem[] {
    return inject(KEY) as NavigationMenuItem[];
}