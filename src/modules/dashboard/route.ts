import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";

const MODULE_NAME = 'psr-dashboard'
export const ROUTE_DASHBOARD_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/list',
    path: '',
    component: () => import("./views/list/index.vue"),
    meta: {tag: {title: '清单'}, permission: ['add', 'design']}
}

export const ROUTE_DASHBOARD_DISPLAY: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/display',
    path: ':templateId/display',
    component: () => import("./views/display/index.vue"),
    props: true,
    meta: {tag: {title: '显示'}, permission: ['design']}
}
export const ROUTE_DASHBOARD_DESIGN: PsrAppRouteRecordRaw = {
    name: MODULE_NAME + '/design',
    path: ':templateId/design',
    component: () => import("./views/design/index.vue"),
    props: true,
    meta: {tag: {title: '设计'}}
}


export const ROUTE_DASHBOARD: PsrAppRouteRecordRaw = {
    name: MODULE_NAME,
    path: MODULE_NAME,
    component: () => import("./views/index.vue"),
    meta: {tag: {isAffix: true, title: '概览', iconCls: 'pi pi-chart-bar'}},
    children: [ROUTE_DASHBOARD_LIST, ROUTE_DASHBOARD_DISPLAY, ROUTE_DASHBOARD_DESIGN]
}

export const routes = [ROUTE_DASHBOARD]