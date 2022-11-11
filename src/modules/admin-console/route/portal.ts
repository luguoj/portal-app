import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_PORTAL_NAME = 'admin-console/portal'
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