import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";

const MODULE_NAME = 'admin-console'

export const ROUTE_PORTAL_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/permission',
    path: MODULE_NAME + '/portal/permission',
    component: () => import("./views/portal/permission/AdminConsolePermission.vue"),
    meta: {tag: {title: '许可', iconCls: 'pi pi-key'}, permission: []}
}
export const ROUTE_PORTAL_USER: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/user',
    path: MODULE_NAME + '/portal/user',
    component: () => import("./views/portal/user/AdminConsoleUser.vue"),
    meta: {tag: {title: '用户', iconCls: 'pi pi-users'}, permission: []}
}
export const ROUTE_PORTAL_GROUP_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/group/list',
    path: '',
    component: () => import("./views/portal/group/AdminConsoleGroupList.vue"),
    meta: {tag: {title: '分组清单',}, permission: ['add', 'edit', 'delete']}
}
export const ROUTE_PORTAL_GROUP_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/group/permission',
    path: ':groupId/permission',
    component: () => import("./views/portal/group/AdminConsoleGroupPermission.vue"),
    props: true,
    meta: {tag: {title: '分组许可'}, permission: []}
}
export const ROUTE_PORTAL_GROUP_USER: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/group/user',
    path: ':groupId/user',
    component: () => import("./views/portal/group/AdminConsoleGroupUser.vue"),
    props: true,
    meta: {tag: {title: '分组用户',}, permission: []}
}
export const ROUTE_PORTAL_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/portal/group',
    path: MODULE_NAME + '/portal/group',
    component: () => import("./views/portal/group/AdminConsoleGroup.vue"),
    meta: {tag: {title: '分组', iconCls: 'pi pi-tag'}, permission: []},
    children: [ROUTE_PORTAL_GROUP_LIST, ROUTE_PORTAL_GROUP_PERMISSION, ROUTE_PORTAL_GROUP_USER]
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_PORTAL_PERMISSION, ROUTE_PORTAL_GROUP, ROUTE_PORTAL_USER]