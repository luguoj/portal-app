import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

const MODULE_ENTITY_NAME = 'admin-console/entity'

export const ROUTE_ENTITY: PsrAppRouteRecordRaw = {
    name: MODULE_ENTITY_NAME,
    path: MODULE_ENTITY_NAME,
    component: () => import('../views/entity/index.vue'),
    meta: {tag: {title: '实体浏览器', iconCls: 'pi pi-database'}, permissions: ['add', 'delete', 'edit']}
}