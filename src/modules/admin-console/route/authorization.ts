import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_AUTHORIZATION_NAME = 'admin-console/authorization'

export const ROUTE_AUTHORIZATION_USER_LIST: PsrAppRouteRecordRaw = {
    name: MODULE_AUTHORIZATION_NAME + '/user/list',
    path: '',
    component: () => import("../views/authorization/user/list/index.vue"),
    meta: {tag: {title: '用户清单',}, permission: ['add', 'edit', 'delete', 'resetPassword']}
}
export const ROUTE_AUTHORIZATION_USER_AUTHORITY: PsrAppRouteRecordRaw = {
    name: MODULE_AUTHORIZATION_NAME + '/user/authority',
    path: ':userId/authority',
    component: () => import("../views/authorization/user/authority/index.vue"),
    props: true,
    meta: {tag: {title: '用户权限'}, permission: []}
}
export const ROUTE_AUTHORIZATION_USER_GROUP: PsrAppRouteRecordRaw = {
    name: MODULE_AUTHORIZATION_NAME + '/user/group',
    path: ':userId/group',
    component: () => import("../views/authorization/user/group/index.vue"),
    props: true,
    meta: {tag: {title: '用户分组',}, permission: []}
}
export const ROUTE_AUTHORIZATION_USER: PsrAppRouteRecordRaw = {
    name: MODULE_AUTHORIZATION_NAME + '/user',
    path: MODULE_AUTHORIZATION_NAME + '/user',
    component: () => import('../views/authorization/user/index.vue'),
    meta: {tag: {title: '用户', iconCls: 'pi pi-user'}, permission: []},
    children: [ROUTE_AUTHORIZATION_USER_LIST, ROUTE_AUTHORIZATION_USER_AUTHORITY, ROUTE_AUTHORIZATION_USER_GROUP]
}