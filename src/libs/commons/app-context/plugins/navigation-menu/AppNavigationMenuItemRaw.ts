import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";

export type AppNavigationMenuItemRaw = AppMenuItemSubMenuRaw | AppMenuItemRouteItemRaw

interface AppMenuItemSubMenuRaw {
    id: string,
    title: string
    iconCls: string,
    children: AppNavigationMenuItemRaw[],
    route?: never
}

interface AppMenuItemRouteItemRaw {
    id: string,
    title?: string
    iconCls?: string,
    children?: never,
    route: PSRRouteRecordRaw
}

