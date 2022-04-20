import {PsrAppRouteRecordRaw} from "@/libs/commons/app-context/route/types/PsrAppRouteRecordRaw";
import PsrBlank from "@/libs/components/psr/views/PsrBlank.vue";

export const ROUTE_BLANK: PsrAppRouteRecordRaw = {
    name: 'blank',
    path: '',
    component: PsrBlank,
    meta: {tag: {isAffix: true, title: '', iconCls: ''}}
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_BLANK]