import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_ORGANIZATION_NAME = 'admin-console/organization'

export const ROUTE_ORGANIZATION_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_ORGANIZATION_NAME + '/list',
    path: '',
    component: () => import("../views/organization/list/index.vue"),
    meta: {tag: {title: '清单',}, permissions: ['add', 'edit', 'delete']}
}
export const ROUTE_ORGANIZATION_MEMBER: PsrAppRouteRecordRaw = {
    name: MODULE_ORGANIZATION_NAME + '/member',
    path: ':organizationId/member',
    component: () => import("../views/organization/member/index.vue"),
    props: true,
    meta: {tag: {title: '成员'}, permissions: []}
}
export const ROUTE_ORGANIZATION: PsrAppRouteRecordRaw = {
    name: MODULE_ORGANIZATION_NAME,
    path: MODULE_ORGANIZATION_NAME,
    component: () => import('../views/organization/index.vue'),
    meta: {tag: {title: '组织管理', iconCls: 'pi pi-sitemap'}, permissions: []},
    children: [ROUTE_ORGANIZATION_LIST, ROUTE_ORGANIZATION_MEMBER]
}