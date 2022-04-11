import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";
import PsrPageBlank from "../views/page/PsrViewPartPageBlank.vue";

export const ROUTE_HOME: PsrAppRouteRecordRaw = {
    name: 'home',
    path: '',
    component: PsrPageBlank,
    meta: {
        tag: {
            isAffix: true,
            title: '首页',
            iconCls: 'pi pi-home'
        }
    }
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_HOME]