import AdminPermission from "@/modules/admin-console/views/permission/AdminConsolePermission.vue";
import AdminUser from "@/modules/admin-console/views/user/AdminConsoleUser.vue";
import AdminGroup from "@/modules/admin-console/views/group/AdminConsoleGroup.vue";
import AdminGroupList from "@/modules/admin-console/views/group/AdminConsoleGroupList.vue";
import AdminGroupPermission from "@/modules/admin-console/views/group/AdminConsoleGroupPermission.vue";
import AdminGroupUser from "@/modules/admin-console/views/group/AdminConsoleGroupUser.vue";
import {PSRRouteRecordRaw} from "@/libs/commons/router";

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
    path: '/admin-console/permission',
    component: AdminPermission,
    meta: {
        tag: {
            title: '许可',
            iconCls: 'pi pi-key',
        },
        permission: {}
    }
}

export const ROUTE_ADMIN_USER: PSRRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.USER,
    path: '/admin-console/user',
    component: AdminUser,
    meta: {
        tag: {
            title: '用户',
            iconCls: 'pi pi-users'
        },
        permission: {}
    }
}

export const ROUTE_ADMIN_GROUP: PSRRouteRecordRaw = {
    name: ADMIN_CONSOLE_ROUTE_NAME.GROUP,
    path: '/admin-console/group',
    component: AdminGroup,
    meta: {
        tag: {
            title: '分组',
            iconCls: 'pi pi-tag'
        },
        permission: {}
    },
    children: [{
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST,
        path: '',
        component: AdminGroupList,
        meta: {
            tag: {
                title: '分组清单',
            },
            permission: {
                actions: ['add', 'edit', 'delete']
            }
        }
    }, {
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_PERMISSION,
        path: ':groupId/permission',
        component: AdminGroupPermission,
        props: true,
        meta: {
            tag: {
                title: '分组许可',
            },
            permission: {}
        }
    }, {
        name: ADMIN_CONSOLE_ROUTE_NAME.GROUP_USER,
        path: ':groupId/user',
        component: AdminGroupUser,
        props: true,
        meta: {
            tag: {
                title: '分组用户',
            },
            permission: {}
        }
    }]
}

export const routes: Array<PSRRouteRecordRaw> = [ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_GROUP, ROUTE_ADMIN_USER]