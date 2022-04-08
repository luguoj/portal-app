import {PsrAppRouteRecordRaw} from "../../route/types/PsrAppRouteRecordRaw";

export type PsrAppNavigationMenuItemRaw = PsrAppNavigationMenuSubMenuRaw | PsrAppNavigationMenuRouteRaw

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

