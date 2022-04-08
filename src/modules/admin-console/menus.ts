import {ROUTE_ADMIN_GROUP, ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_USER} from "@/modules/admin-console/route";

export const menus = [{
    id: 'admin-console',
    title: '管理员控制台',
    iconCls: 'pi pi-cog',
    children: [{
        route: ROUTE_ADMIN_PERMISSION
    }, {
        route: ROUTE_ADMIN_GROUP
    }, {
        route: ROUTE_ADMIN_USER
    }]
}]