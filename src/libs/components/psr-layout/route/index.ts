import PsrLayoutPageBlank from "@/libs/components/psr-layout/views/page/blank/PsrLayoutPageBlank.vue";
import {PSRRouteRecordRaw} from "psr-app-context/route";

export const ROUTE_HOME: PSRRouteRecordRaw = {
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

export const routes: Array<PSRRouteRecordRaw> = [ROUTE_HOME]