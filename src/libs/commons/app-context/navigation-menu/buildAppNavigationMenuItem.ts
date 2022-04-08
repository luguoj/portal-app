import {AppNavigationMenuItemRaw} from "psr-app-context/navigation-menu/AppNavigationMenuItemRaw";
import {AppNavigationMenuItem} from "psr-app-context/navigation-menu/AppNavigationMenuItem";
import {buildLayoutChildRoute} from "psr-app-context/route";

export function buildAppNavigationMenuItem(menuItemRaw: AppNavigationMenuItemRaw, layoutName: string): AppNavigationMenuItem {
    if (menuItemRaw.children != undefined) {
        const newChildren: AppNavigationMenuItem[] = []
        for (let i = 0; i < menuItemRaw.children.length; i++) {
            const child = menuItemRaw.children[i];
            newChildren.push(buildAppNavigationMenuItem(child, layoutName))
        }
        const {id, title, iconCls} = menuItemRaw
        return {id: `${layoutName}/${id}`, title, iconCls, children: newChildren}
    } else {
        const route = buildLayoutChildRoute(menuItemRaw.route, layoutName)
        return {
            id: route.name,
            title: route.meta.tag.title,
            iconCls: route.meta.tag.iconCls || "pi pi-book",
            layoutName,
            route
        }
    }
}