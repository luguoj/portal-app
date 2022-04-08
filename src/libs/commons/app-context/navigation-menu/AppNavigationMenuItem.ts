import {PSRRouteRecord} from "psr-app-context/route";

export type AppNavigationMenuItem = AppMenuItemSubMenu | AppMenuItemRouteItem

interface AppMenuItemBase {
    id: string
    title: string
    iconCls: string
}

interface AppMenuItemSubMenu extends AppMenuItemBase {
    children: AppNavigationMenuItem[]
    layoutName?: never
    route?: never
}

interface AppMenuItemRouteItem extends AppMenuItemBase {
    layoutName: string
    children?: never
    route: PSRRouteRecord
}