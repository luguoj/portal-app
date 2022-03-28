import {PSRRouteRecordRaw} from "@/libs/commons/router";

export type NavigationMenuItemRaw = MenuItemSubMenuRaw | MenuItemRouteItemRaw

interface MenuItemSubMenuRaw {
    id: string,
    title: string
    iconCls: string,
    children: NavigationMenuItemRaw[],
    route?: never
}

interface MenuItemRouteItemRaw {
    id: string,
    title?: string
    iconCls?: string,
    children?: never,
    route: PSRRouteRecordRaw
}

