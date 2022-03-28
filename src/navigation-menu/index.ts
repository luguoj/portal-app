import {NavigationMenuItemRaw} from "@/libs/commons/navigation-menu/NavigationMenuItemRaw";
import {createNavigationMenu} from "@/libs/commons/navigation-menu/NavigationMenuProvider";
import {Modules} from "@/modules";

const menus: NavigationMenuItemRaw[] = []
for (const module of Modules) {
    if (module.menus) {
        menus.push(...module.menus)
    }
}

export const navigationMenu = createNavigationMenu({
    menus
})
