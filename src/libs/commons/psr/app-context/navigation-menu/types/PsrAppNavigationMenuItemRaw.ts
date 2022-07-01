import {PsrAppRouteRecordRaw} from "../../route/types/PsrAppRouteRecordRaw";

export type PsrAppNavigationMenuItemRaw = PsrAppNavigationMenuSubMenuRaw | PsrAppNavigationMenuRouteRaw
export type MenuUsage = 'aside' | 'userPopover' | string
export type PsrAppNavigationMenuItemsRaw = Record<MenuUsage, PsrAppNavigationMenuItemRaw[]>

interface PsrAppNavigationMenuSubMenuRaw {
    id: string,
    title: string
    iconCls: string,
    children: PsrAppNavigationMenuItemRaw[],
    route?: never
}

interface PsrAppNavigationMenuRouteRaw {
    id?: never,
    title?: never
    iconCls?: never,
    children?: never,
    route: PsrAppRouteRecordRaw
}

