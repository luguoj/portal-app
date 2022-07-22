import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";
import {ROUTE_PORTAL_DASHBOARD, ROUTE_PORTAL_GROUP, ROUTE_PORTAL_PERMISSION, ROUTE_PORTAL_USER} from "./portal";
import {ROUTE_AUTHORIZATION_USER} from "./authorization";
import {ROUTE_ENTITY} from "@/modules/admin-console/route/entity";
import {ROUTE_ORGANIZATION} from "@/modules/admin-console/route/organization";

export * from './entity'
export * from './authorization'
export * from './portal'
export * from './organization'
export const routes: Array<PsrAppRouteRecordRaw> = [
    ROUTE_AUTHORIZATION_USER,
    ROUTE_PORTAL_PERMISSION,
    ROUTE_PORTAL_GROUP,
    ROUTE_PORTAL_USER,
    ROUTE_PORTAL_DASHBOARD,
    ROUTE_ENTITY,
    ROUTE_ORGANIZATION
]