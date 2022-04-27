import {PsrAppRouteRecord} from "../../route";

export type PsrAppNavigationMenuItem = PsrAppNavigationMenuSubMenu | PsrAppNavigationMenuRoute

interface PsrAppNavigationMenuItemBase {
    id: string
    title: string
    iconCls: string,
    permission: boolean
}

interface PsrAppNavigationMenuSubMenu extends PsrAppNavigationMenuItemBase {
    children: PsrAppNavigationMenuItem[]
    layoutName?: never
    route?: never
}

interface PsrAppNavigationMenuRoute extends PsrAppNavigationMenuItemBase {
    layoutName: string
    children?: never
    route: PsrAppRouteRecord
}