import {HOME} from "@/router/desktop";
import {SAMPLE, SAMPLE_2, SAMPLE_PARENT} from "@/router/sample-pages";
import {ADMIN_GROUP, ADMIN_PERMISSION, ADMIN_USER} from "@/router/admin";

export const MenuRoutes = [{
    id: 'desktop',
    route: HOME
}, {
    id: 'admin',
    title: '门户管理',
    iconCls: 'pi pi-cog',
    children: [{
        id: 'admin-permission',
        title: '许可',
        iconCls: 'pi pi-key',
        route: ADMIN_PERMISSION
    }, {
        id: 'admin-group',
        title: '用户分组',
        iconCls: 'pi pi-tag',
        route: ADMIN_GROUP
    }, {
        id: 'admin-user',
        title: '用户',
        iconCls: 'pi pi-users',
        route: ADMIN_USER
    }]
}, {
    id: 'sample-pages',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        id: 'sample',
        title: '样例',
        iconCls: 'pi pi-book',
        route: SAMPLE
    }, {
        id: 'sample-parent',
        title: '嵌套页面',
        iconCls: 'pi pi-book',
        route: SAMPLE_PARENT
    }, {
        id: 'sample-2',
        title: '样例-2',
        iconCls: 'pi pi-book',
        route: SAMPLE_2
    }]
}]