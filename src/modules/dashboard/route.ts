import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";

export const ROUTE_SIGN_IN: PsrAppRouteRecordRaw = {
    name: 'psr-dashboard',
    path: 'dashboard',
    component: () => import("./views/Dashboard.vue"),
    meta: {
        tag: {
            isAffix: true,
            title: '概览',
            iconCls: 'pi pi-home'
        }
    }
}

export const routes = [ROUTE_SIGN_IN]