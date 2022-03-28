import {PSRRouteRecordRaw} from "@/libs/commons/router";

export type NavigationMenuItem = MenuItemSubMenu | MenuItemRouteItem
export const MenuInvalid: NavigationMenuItem = {id: '', title: "", iconCls: "", children: []}

interface MenuItemBase {
    id: string,
    title: string
    iconCls: string,
}

interface MenuItemSubMenu extends MenuItemBase {
    children: NavigationMenuItem[],
    route?: never
}

interface MenuItemRouteItem extends MenuItemBase {
    children?: never,
    route: PSRRouteRecordRaw
}