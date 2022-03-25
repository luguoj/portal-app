import AdminPermission from "@/views/admin/permission/AdminPermission.vue";
import AdminUser from "@/views/admin/user/AdminUser.vue";
import AdminGroup from "@/views/admin/group/AdminGroup.vue";
import AdminGroupList from "@/views/admin/group/AdminGroupList.vue";
import AdminGroupPermission from "@/views/admin/group/AdminGroupPermission.vue";
import AdminGroupUser from "@/views/admin/group/AdminGroupUser.vue";
import {PSRRouteRecordRaw} from "@/router/RouteRecordRaw";

export const ROUTE_NAME_ADMIN = {
    GROUP: 'admin-group',
    GROUP_LIST: 'admin-group-list',
    GROUP_PERMISSION: 'admin-group-permission',
    GROUP_USER: 'admin-group-user'
}

export const ROUTE_ADMIN_PERMISSION: PSRRouteRecordRaw = {
    name: 'admin-permission',
    path: '/admin/permission',
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
    name: 'admin-user',
    path: '/admin/user',
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
    name: ROUTE_NAME_ADMIN.GROUP,
    path: '/admin/group',
    component: AdminGroup,
    meta: {
        tag: {
            title: '分组',
            iconCls: 'pi pi-tag'
        },
        permission: {}
    },
    children: [{
        name: ROUTE_NAME_ADMIN.GROUP_LIST,
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
        name: ROUTE_NAME_ADMIN.GROUP_PERMISSION,
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
        name: ROUTE_NAME_ADMIN.GROUP_USER,
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

export const ROUTES_ADMIN: Array<PSRRouteRecordRaw> = [ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_GROUP, ROUTE_ADMIN_USER]