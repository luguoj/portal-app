import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_PORTAL_NAME = 'admin-console/portal'
export const ROUTE_PORTAL_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/permission',
    path: MODULE_PORTAL_NAME + '/permission',
    component: () => import("../views/portal/permission/AdminConsolePermission.vue"),
    meta: {tag: {title: '许可', iconCls: 'pi pi-key'}, permission: []}
}
export const ROUTE_PORTAL_USER: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/user',
    path: MODULE_PORTAL_NAME + '/user',
    component: () => import("../views/portal/user/AdminConsoleUser.vue"),
    meta: {tag: {title: '用户', iconCls: 'pi pi-users'}, permission: []}
}
export const ROUTE_PORTAL_GROUP_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/list',
    path: '',
    component: () => import("../views/portal/group/AdminConsoleGroupList.vue"),
    meta: {tag: {title: '分组清单',}, permission: ['add', 'edit', 'delete']}
}
export const ROUTE_PORTAL_GROUP_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/permission',
    path: ':groupId/permission',
    component: () => import("../views/portal/group/AdminConsoleGroupPermission.vue"),
    props: true,
    meta: {tag: {title: '分组许可'}, permission: []}
}
export const ROUTE_PORTAL_GROUP_USER: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/user',
    path: ':groupId/user',
    component: () => import("../views/portal/group/AdminConsoleGroupUser.vue"),
    props: true,
    meta: {tag: {title: '分组用户',}, permission: []}
}
export const ROUTE_PORTAL_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group',
    path: MODULE_PORTAL_NAME + '/group',
    component: () => import("../views/portal/group/AdminConsoleGroup.vue"),
    meta: {tag: {title: '分组', iconCls: 'pi pi-tag'}, permission: []},
    children: [ROUTE_PORTAL_GROUP_LIST, ROUTE_PORTAL_GROUP_PERMISSION, ROUTE_PORTAL_GROUP_USER]
}