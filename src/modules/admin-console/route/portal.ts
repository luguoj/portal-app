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
    meta: {tag: {title: '功能许可', iconCls: 'pi pi-key'}, permissions: []},
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
    meta: {tag: {title: '用户', iconCls: 'pi pi-users'}, permissions: []},
    children: [ROUTE_PORTAL_USER_LIST, ROUTE_PORTAL_USER_GROUP]
}

export const ROUTE_PORTAL_DASHBOARD_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/dashboard/list',
    path: '',
    component: () => import("../views/portal/dashboard/list/index.vue"),
    meta: {tag: {title: '清单'}, permissions: ['add', 'delete', 'edit']}
}
export const ROUTE_PORTAL_DASHBOARD_DESIGN_MASONRY: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/dashboard/design/masonry',
    path: ':dashboardTemplateId/design/masonry',
    component: () => import("../views/portal/dashboard/design/masonry/index.vue"),
    props: true,
    meta: {tag: {title: '设计'}, permissions: []}
}
export const ROUTE_PORTAL_DASHBOARD_DESIGN_BIG_SCREEN: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/dashboard/design/big_screen',
    path: ':dashboardTemplateId/design/big_screen',
    component: () => import("../views/portal/dashboard/design/big-screen/index.vue"),
    props: true,
    meta: {tag: {title: '设计'}, permissions: []}
}
export const ROUTE_PORTAL_DASHBOARD: PsrAppRouteRecordRaw = {
    name: MODULE_PORTAL_NAME + '/dashboard',
    path: MODULE_PORTAL_NAME + '/dashboard',
    component: () => import("../views/portal/dashboard/index.vue"),
    meta: {tag: {title: '仪表盘', iconCls: 'pi pi-chart-bar'}, permissions: []},
    children: [ROUTE_PORTAL_DASHBOARD_LIST, ROUTE_PORTAL_DASHBOARD_DESIGN_MASONRY, ROUTE_PORTAL_DASHBOARD_DESIGN_BIG_SCREEN]
}