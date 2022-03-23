import {ROUTE_HOME} from "@/router/desktop";
import {
    ROUTE_ADMIN_GROUP,
    ROUTE_ADMIN_PERMISSION,
    ROUTE_ADMIN_USER,
} from "@/router/admin";
import {
    ROUTE_SAMPLE,
    ROUTE_SAMPLE_2,
    ROUTE_SAMPLE_PARENT,
} from "@/router/sample-pages";
import {RouteRecordRaw} from "vue-router";

export interface MenuItem {
    id: string,
    title?: string
    iconCls?: string,
    children?: MenuItem[],
    route?: RouteRecordRaw
}

export const ASIDE_MENU_ITEMS: MenuItem[] = [{
    id: 'desktop',
    route: ROUTE_HOME
}, {
    id: 'admin',
    title: '门户管理',
    iconCls: 'pi pi-cog',
    children: [{
        id: 'admin-permission',
        route: ROUTE_ADMIN_PERMISSION
    }, {
        id: 'admin-group',
        route: ROUTE_ADMIN_GROUP
    }, {
        id: 'admin-user',
        route: ROUTE_ADMIN_USER
    }]
}, {
    id: 'sample-pages',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        id: 'sample',
        title: '样例',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE
    }, {
        id: 'sample-parent',
        title: '嵌套页面',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_PARENT
    }, {
        id: 'sample-2',
        title: '样例-2',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_2
    }]
}]
