import {ROUTE_PORTAL_GROUP, ROUTE_PORTAL_PERMISSION, ROUTE_PORTAL_USER} from "@/modules/admin-console/route";

export const menus = [{
    id: 'admin-console-portal',
    title: '门户管理',
    iconCls: 'pi pi-cog',
    children: [{
        route: ROUTE_PORTAL_PERMISSION
    }, {
        route: ROUTE_PORTAL_GROUP
    }, {
        route: ROUTE_PORTAL_USER
    }]
}]