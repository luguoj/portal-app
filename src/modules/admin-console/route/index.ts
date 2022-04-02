import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";

export const ADMIN_CONSOLE_ROUTE_NAME = {
    GROUP: 'admin-console-group',
    GROUP_LIST: 'admin-console-group-list',
    GROUP_PERMISSION: 'admin-console-group-permission',
    GROUP_USER: 'admin-console-group-user',
    PERMISSION: 'admin-console-permission',
    USER: 'admin-console-user'
}

export const ROUTE_ADMIN_PERMISSION: PSRRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.PERMISSION,
    path: 'admin-console/permission',
    component: () => import("../views/permission/AdminConsolePermission.vue"),
    meta: {
        tag: {
            title: '许可',
            iconCls: 'pi pi-key',
        },
        permission: {key: ADMIN_CONSOLE_ROUTE_NAME.PERMISSION}
    }
}

export const ROUTE_ADMIN_USER: PSRRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.USER,
    path: 'admin-console/user',
    component: () => import("../views/user/AdminConsoleUser.vue"),
    meta: {
        tag: {
            title: '用户',
            iconCls: 'pi pi-users'
        },
        permission: {key: ADMIN_CONSOLE_ROUTE_NAME.USER}
    }
}

export const ROUTE_ADMIN_GROUP: PSRRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.GROUP,
    path: 'admin-console/group',
    component: () => import("../views/group/AdminConsoleGroup.vue"),
    meta: {
        tag: {
            title: '分组',
            iconCls: 'pi pi-tag'
        },
        permission: {key: ADMIN_CONSOLE_ROUTE_NAME.GROUP}
    },
    children: [{
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST,
        path: '',
        component: () => import("../views/group/AdminConsoleGroupList.vue"),
        meta: {
            tag: {
                title: '分组清单',
            },
            permission: {
                key: ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST,
                permissions: ['add', 'edit', 'delete']
            }
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
            permission: {key: ADMIN_CONSOLE_ROUTE_NAME.GROUP_PERMISSION}
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
            permission: {key: ADMIN_CONSOLE_ROUTE_NAME.GROUP_USER}
        }
    }]
}

export const routes: Array<PSRRouteRecordRaw> = [ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_GROUP, ROUTE_ADMIN_USER]