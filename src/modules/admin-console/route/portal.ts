import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_PORTAL_NAME = 'admin-console/portal'
export const ROUTE_PORTAL_PERMISSION_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/permission/list',
    path: '',
    component: () => import("../views/portal/permission/list/index.vue"),
    meta: {tag: {title: '清单'}, permissions: []}
}
export const ROUTE_PORTAL_PERMISSION_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/permission/group',
    path: ':permissionKey/group',
    component: () => import("../views/portal/permission/group/index.vue"),
    props: true,
    meta: {tag: {title: '关联分组'}, permissions: ['update']}
}
export const ROUTE_PORTAL_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/permission',
    path: MODULE_PORTAL_NAME + '/permission',
    component: () => import("../views/portal/permission/index.vue"),
    meta: {tag: {title: '门户功能许可', iconCls: 'pi pi-key'}, permissions: []},
    children: [ROUTE_PORTAL_PERMISSION_LIST, ROUTE_PORTAL_PERMISSION_GROUP]
}
export const ROUTE_PORTAL_USER_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/user/list',
    path: '',
    component: () => import("../views/portal/user/list/index.vue"),
    meta: {tag: {title: '清单'}, permissions: []}
}
export const ROUTE_PORTAL_USER_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/user/group',
    path: ':userId/group',
    component: () => import("../views/portal/user/group/index.vue"),
    props: true,
    meta: {tag: {title: '关联分组'}, permissions: ['update']}
}
export const ROUTE_PORTAL_USER: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/user',
    path: MODULE_PORTAL_NAME + '/user',
    component: () => import("../views/portal/user/index.vue"),
    meta: {tag: {title: '门户用户', iconCls: 'pi pi-users'}, permissions: []},
    children: [ROUTE_PORTAL_USER_LIST, ROUTE_PORTAL_USER_GROUP]
}
export const ROUTE_PORTAL_GROUP_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/list',
    path: '',
    component: () => import("../views/portal/group/list/index.vue"),
    meta: {tag: {title: '清单',}, permissions: ['add', 'edit', 'delete']}
}
export const ROUTE_PORTAL_GROUP_PERMISSION: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/permission',
    path: ':groupId/permission',
    component: () => import("../views/portal/group/permission/index.vue"),
    props: true,
    meta: {tag: {title: '关联许可'}, permissions: ['update']}
}
export const ROUTE_PORTAL_GROUP_USER: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group/user',
    path: ':groupId/user',
    component: () => import("../views/portal/group/user/index.vue"),
    props: true,
    meta: {tag: {title: '关联用户',}, permissions: []}
}
export const ROUTE_PORTAL_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/group',
    path: MODULE_PORTAL_NAME + '/group',
    component: () => import("../views/portal/group/index.vue"),
    meta: {tag: {title: '门户用户分组', iconCls: 'pi pi-tag'}, permissions: []},
    children: [ROUTE_PORTAL_GROUP_LIST, ROUTE_PORTAL_GROUP_PERMISSION, ROUTE_PORTAL_GROUP_USER]
}