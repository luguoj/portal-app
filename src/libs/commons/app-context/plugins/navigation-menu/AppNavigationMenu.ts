import {AppNavigationMenuItem} from "./AppNavigationMenuItem";
import {AppNavigationMenuItemRaw} from "./AppNavigationMenuItemRaw";
import {ref} from "vue";
import {AppPlugin} from "../../AppPlugin";

export class AppNavigationMenu extends AppPlugin {
    readonly menuItems = ref<AppNavigationMenuItem[]>([])

    update(navigationMenuRaw: AppNavigationMenuItemRaw[]) {
        this.menuItems.value = buildMenuItems(navigationMenuRaw)
    }
}

function buildMenuItems(menuRaw: AppNavigationMenuItemRaw[]): AppNavigationMenuItem[] {
    const menuItems: AppNavigationMenuItem[] = []
    for (let i = 0; i < menuRaw.length; i++) {
        const menuItemRaw = menuRaw[i];
        if (menuItemRaw.children != undefined) {
            if (menuItemRaw.children.length > 0) {
                const newChildren = buildMenuItems(menuItemRaw.children)
                if (newChildren.length > 0) {
                    const {id, title, iconCls} = menuItemRaw
                    menuItems.push({id, title, iconCls, children: newChildren})
                }
            }
        } else {
            const {id, title, iconCls, route} = menuItemRaw
            menuItems.push({
                id,
                title: title || route.meta?.tag?.title || id,
                iconCls: iconCls || route.meta?.tag?.iconCls || "pi pi-book",
                route
            })
        }
    }
    return menuItems
}