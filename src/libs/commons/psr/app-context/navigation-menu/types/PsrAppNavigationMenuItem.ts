import {PsrAppRouteRecord} from "../../route";
import {MenuUsage} from "@/libs/commons/psr/app-context/navigation-menu";

export type PsrAppNavigationMenuItem = PsrAppNavigationMenuSubMenu | PsrAppNavigationMenuRoute
export type PsrAppNavigationMenuItems = Record<MenuUsage, PsrAppNavigationMenuItem[]>

interface PsrAppNavigationMenuItemBase {
    id: string
    title: string
    iconCls: string,
    permissions: string[] | false
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