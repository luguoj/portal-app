import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";

export type AppNavigationMenuItem = AppMenuItemSubMenu | AppMenuItemRouteItem

interface AppMenuItemBase {
    id: string,
    title: string
    iconCls: string,
}

interface AppMenuItemSubMenu extends AppMenuItemBase {
    children: AppNavigationMenuItem[],
    route?: never
}

interface AppMenuItemRouteItem extends AppMenuItemBase {
    children?: never,
    route: PSRRouteRecordRaw
}