import {PsrAppNavigationMenuItemRaw} from "./types/PsrAppNavigationMenuItemRaw";
import {PsrAppNavigationMenuItem} from "./types/PsrAppNavigationMenuItem";
import {buildLayoutChildRoute} from "../route";

export function buildMenuItem(menuItemRaw: PsrAppNavigationMenuItemRaw, layoutName: string): PsrAppNavigationMenuItem {
    if (menuItemRaw.children != undefined) {
        const newChildren: PsrAppNavigationMenuItem[] = []
        for (let i = 0; i < menuItemRaw.children.length; i++) {
            const child = menuItemRaw.children[i];
            newChildren.push(buildMenuItem(child, layoutName))
        }
        const {id, title, iconCls} = menuItemRaw
        return {id: `${layoutName}/${id}`, title, iconCls, children: newChildren, permission: false}
    } else {
        const route = buildLayoutChildRoute(menuItemRaw.route, layoutName)
        return {
            id: route.name,
            title: route.meta.tag.title,
            iconCls: route.meta.tag.iconCls || "pi pi-book",
            layoutName,
            route,
            permission: route.meta.permission !== undefined
        }
    }
}