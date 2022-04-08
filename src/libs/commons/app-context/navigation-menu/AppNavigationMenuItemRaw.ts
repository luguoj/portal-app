import {PSRRouteRecordRaw} from "psr-app-context/route";

export type AppNavigationMenuItemRaw = AppMenuItemSubMenuRaw | AppMenuItemRouteItemRaw

interface AppMenuItemSubMenuRaw {
    id: string,
    title: string
    iconCls: string,
    children: AppNavigationMenuItemRaw[],
    route?: never
}

interface AppMenuItemRouteItemRaw {
    id?: never,
    title?: never
    iconCls?: never,
    children?: never,
    route: PSRRouteRecordRaw
}

