import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";
import {ROUTE_PORTAL_DASHBOARD, ROUTE_PORTAL_GROUP, ROUTE_PORTAL_PERMISSION, ROUTE_PORTAL_USER} from "./portal";

export * from './portal'
export const routes: Array<PsrAppRouteRecordRaw> = [
    ROUTE_PORTAL_PERMISSION,
    ROUTE_PORTAL_GROUP,
    ROUTE_PORTAL_USER,
    ROUTE_PORTAL_DASHBOARD
]