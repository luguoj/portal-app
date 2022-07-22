import {ROUTE_AUTHORIZATION_USER, ROUTE_ENTITY, ROUTE_ORGANIZATION, ROUTE_PORTAL_DASHBOARD, ROUTE_PORTAL_GROUP, ROUTE_PORTAL_PERMISSION, ROUTE_PORTAL_USER} from "./route";
import {PsrAppNavigationMenuItemsRaw} from "@/libs/commons/psr/app-context/navigation-menu";

export const menus: PsrAppNavigationMenuItemsRaw = {
    aside: [{
        id: 'admin-console-authorization',
        title: '授权管理',
        iconCls: 'pi pi-key',
        children: [{
            route: ROUTE_AUTHORIZATION_USER
        }]
    }, {
        id: 'admin-console-portal',
        title: '门户管理',
        iconCls: 'pi pi-cog',
        children: [{
            route: ROUTE_PORTAL_USER
        }, {
            route: ROUTE_PORTAL_GROUP
        }, {
            route: ROUTE_PORTAL_PERMISSION
        }, {
            route: ROUTE_PORTAL_DASHBOARD
        }]
    }, {
        route: ROUTE_ORGANIZATION
    }, {
        route: ROUTE_ENTITY
    }]
}