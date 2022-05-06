import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";

export const ROUTE_DASHBOARD: PsrAppRouteRecordRaw = {
    name: 'dashboard',
    path: 'dashboard',
    component: () => import("./views/index.vue"),
    meta: {
        tag: {
            isAffix: true,
            title: '概览',
            iconCls: 'pi pi-chart-bar'
        }
    }
}

export const routes = [ROUTE_DASHBOARD]