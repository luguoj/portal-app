import {PSRRouteRecordRaw} from "psr-app-context/route";

export const ROUTE_SIGN_IN: PSRRouteRecordRaw = {
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