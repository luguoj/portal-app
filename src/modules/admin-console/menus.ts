import {ROUTE_ADMIN_GROUP, ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_USER} from "@/modules/admin-console/route";

export const menus = [{
    id: 'admin-console',
    title: '管理员控制台',
    iconCls: 'pi pi-cog',
    children: [{
        id: 'admin-console-permission',
        route: ROUTE_ADMIN_PERMISSION
    }, {
        id: 'admin-console-group',
        route: ROUTE_ADMIN_GROUP
    }, {
        id: 'admin-console-user',
        route: ROUTE_ADMIN_USER
    }]
}]