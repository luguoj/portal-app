import {ROUTE_PORTAL_DASHBOARD} from "./route";
import {PsrAppNavigationMenuItemsRaw} from "@/libs/commons/psr/app-context/navigation-menu";

export const menus: PsrAppNavigationMenuItemsRaw = {
    aside: [{
        id: 'admin-console-portal',
        title: '门户管理',
        iconCls: 'pi pi-cog',
        children: [{
            route: ROUTE_PORTAL_DASHBOARD
        }]
    }]
}