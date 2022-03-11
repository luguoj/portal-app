import {routeHome} from "@/router/desktop";
import {routeSample, routeSample2, routeSampleParent} from "@/router/sample-pages";
import {routeAdminGroup, routeAdminPermission, routeAdminUser} from "@/router/admin";

export function MenuRoutes() {
    return [{
        id: 'desktop',
        route: routeHome()
    }, {
        id: 'admin',
        title: '门户管理',
        iconCls: 'pi pi-cog',
        children: [{
            id: 'admin-permission',
            title: '许可',
            iconCls: 'pi pi-key',
            route: routeAdminPermission()
        }, {
            id: 'admin-group',
            title: '分组',
            iconCls: 'pi pi-tag',
            route: routeAdminGroup()
        }, {
            id: 'admin-user',
            title: '用户',
            iconCls: 'pi pi-users',
            route: routeAdminUser()
        }]
    }, {
        id: 'sample-pages',
        title: '样例页面',
        iconCls: 'pi pi-book',
        children: [{
            id: 'sample',
            title: '样例',
            iconCls: 'pi pi-book',
            route: routeSample()
        }, {
            id: 'sample-parent',
            title: '嵌套页面',
            iconCls: 'pi pi-book',
            route: routeSampleParent()
        }, {
            id: 'sample-2',
            title: '样例-2',
            iconCls: 'pi pi-book',
            route: routeSample2()
        }]
    }]
}