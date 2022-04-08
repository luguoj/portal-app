import PsrLayoutPageBlank from "@/libs/components/psr-layout/views/page/blank/PsrLayoutPageBlank.vue";
import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";

export const ROUTE_HOME: PsrAppRouteRecordRaw = {
    name: 'home',
    path: '',
    component: PsrLayoutPageBlank,
    meta: {
        tag: {
            isAffix: true,
            title: '首页',
            iconCls: 'pi pi-home'
        }
    }
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_HOME]