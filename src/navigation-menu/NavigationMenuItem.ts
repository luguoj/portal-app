import {PSRRouteRecordRaw} from "@/libs/commons/router/RouteRecordRaw";

export type MenuItemRaw = MenuItemSubMenuRaw | MenuItemRouteItemRaw

export interface MenuItemSubMenuRaw {
    id: string,
    title: string
    iconCls: string,
    children: MenuItemRaw[],
    route?: never
}

export interface MenuItemRouteItemRaw {
    id: string,
    title?: string
    iconCls?: string,
    children?: never,
    route: PSRRouteRecordRaw
}

export type MenuItem = MenuItemSubMenu | MenuItemRouteItem

export interface MenuItemBase {
    id: string,
    title: string
    iconCls: string,
}

export interface MenuItemSubMenu extends MenuItemBase {
    children: MenuItem[],
    route?: never
}

export interface MenuItemRouteItem extends MenuItemBase {
    children?: never,
    route: PSRRouteRecordRaw
}

export const MenuNotPermitted: MenuItem = {id: '', title: "", iconCls: "", children: []}

function buildRouteItem({id, title, iconCls, route}: MenuItemRouteItemRaw): MenuItem {
    return {
        id,
        title: title || route.meta?.tag?.title || id,
        iconCls: iconCls || route.meta?.tag?.iconCls || "pi pi-book",
        route
    }
}

function checkSubMenu(menuItemRaw: MenuItemRaw): menuItemRaw is MenuItemSubMenuRaw {
    return !!menuItemRaw.children
}

export function buildMenuItems(menuItems: MenuItemRaw[]): MenuItem[] {
    return menuItems.map(item => {
        if (checkSubMenu(item)) {
            if (item.children.length > 0) {
                const newChildren = buildMenuItems(item.children)
                if (newChildren.length > 0) {
                    const {id, title, iconCls} = item
                    return {id, title, iconCls, children: newChildren}
                }
            }
        } else {
            return buildRouteItem(item)
        }
        return MenuNotPermitted
    }).filter(item => item !== MenuNotPermitted)
}


export function buildMenuItemsWithPermissions(menuItems: MenuItemRaw[], permissions?: Record<string, string[]>): MenuItem[] {
    return menuItems.map(item => {
        if (checkSubMenu(item)) {
            if (item.children.length > 0) {
                const newChildren = buildMenuItemsWithPermissions(item.children, permissions)
                if (newChildren.length > 0) {
                    const {id, title, iconCls} = item
                    return {id, title, iconCls, children: newChildren}
                }
            }
        } else if (!permissions) {
            return buildRouteItem(item)
        } else if (item.route.meta?.permission && permissions[item.route.name]) {
            return buildRouteItem(item)
        }
        return MenuNotPermitted
    }).filter(item => item !== MenuNotPermitted)
}