import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";

export const ADMIN_CONSOLE_ROUTE_NAME = {
    GROUP: 'admin-console-group',
    GROUP_LIST: 'admin-console-group-list',
    GROUP_PERMISSION: 'admin-console-group-permission',
    GROUP_USER: 'admin-console-group-user',
    PERMISSION: 'admin-console-permission',
    USER: 'admin-console-user'
}

export const ROUTE_ADMIN_PERMISSION: PsrAppRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.PERMISSION,
    path: 'admin-console/permission',
    component: () => import("../views/permission/AdminConsolePermission.vue"),
    meta: {
        tag: {
            title: '许可',
            iconCls: 'pi pi-key',
        },
        permission: []
    }
}

export const ROUTE_ADMIN_USER: PsrAppRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.USER,
    path: 'admin-console/user',
    component: () => import("../views/user/AdminConsoleUser.vue"),
    meta: {
        tag: {
            title: '用户',
            iconCls: 'pi pi-users'
        },
        permission: []
    }
}

export const ROUTE_ADMIN_GROUP: PsrAppRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.GROUP,
    path: 'admin-console/group',
    component: () => import("../views/group/AdminConsoleGroup.vue"),
    meta: {
        tag: {
            title: '分组',
            iconCls: 'pi pi-tag'
        },
        permission: []
    },
    children: [{
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST,
        path: '',
        component: () => import("../views/group/AdminConsoleGroupList.vue"),
        meta: {
            tag: {
                title: '分组清单',
            },
            permission: ['add', 'edit', 'delete']
        }
    }, {
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_PERMISSION,
        path: ':groupId/permission',
        component: () => import("../views/group/AdminConsoleGroupPermission.vue"),
        props: true,
        meta: {
            tag: {
                title: '分组许可',
            },
            permission: []
        }
    }, {
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_USER,
        path: ':groupId/user',
        component: () => import("../views/group/AdminConsoleGroupUser.vue"),
        props: true,
        meta: {
            tag: {
                title: '分组用户',
            },
            permission: []
        }
    }]
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_GROUP, ROUTE_ADMIN_USER]