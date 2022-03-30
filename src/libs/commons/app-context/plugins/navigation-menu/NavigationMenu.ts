import {MenuInvalid, NavigationMenuItem} from "./NavigationMenuItem";
import {NavigationMenuItemRaw} from "./NavigationMenuItemRaw";
import {ref} from "vue";
import {AppPlugin} from "../../AppPlugin";

export class NavigationMenu extends AppPlugin {
    readonly menuItems = ref<NavigationMenuItem[]>([])

    update(navigaionMenuRaw: NavigationMenuItemRaw[]) {
        this.menuItems.value = buildMenuItems(navigaionMenuRaw)
    }
}

function buildMenuItems(menuItems: NavigationMenuItemRaw[]): NavigationMenuItem[] {
    return menuItems.map(item => {
        if (item.children != undefined) {
            if (item.children.length > 0) {
                const newChildren = buildMenuItems(item.children)
                if (newChildren.length > 0) {
                    const {id, title, iconCls} = item
                    return {id, title, iconCls, children: newChildren}
                }
            }
        } else {
            const {id, title, iconCls, route} = item
            return {
                id,
                title: title || route.meta?.tag?.title || id,
                iconCls: iconCls || route.meta?.tag?.iconCls || "pi pi-book",
                route
            }
        }
        return MenuInvalid
    }).filter(item => item !== MenuInvalid)
}