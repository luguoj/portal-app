import PsrLayoutPageBlank from "@/libs/components/psr-layout/views/page/blank/PsrLayoutPageBlank.vue";
import PsrLayoutPageErrorNotFound from "@/libs/components/psr-layout/views/page/error/PsrLayoutPageErrorNotFound.vue";
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";

export const PSR_LAYOUT_ROUTE_NAME = {
    HOME: 'home',
    ERROR_NOT_FOUND: 'error-not-found',
    INITIALIZING: 'initializing'
}
export const ROUTE_PATH_DESKTOP = {
    HOME: '',
    ERROR_NOT_FOUND: ':pathMatch(.*)*'
}
export const HOME_TITLE = '首页'
export const HOME_ICON_CLASS = 'pi pi-home'
export const ROUTE_HOME: PSRRouteRecordRaw = {
    name: PSR_LAYOUT_ROUTE_NAME.HOME,
    path: ROUTE_PATH_DESKTOP.HOME,
    component: PsrLayoutPageBlank,
    meta: {
        tag: {
            isAffix: true,
            title: HOME_TITLE,
            iconCls: HOME_ICON_CLASS
        }
    }
}

export const ROUTE_ERROR_NOT_FOUND: PSRRouteRecordRaw = {
    name: PSR_LAYOUT_ROUTE_NAME.ERROR_NOT_FOUND,
    path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
    component: PsrLayoutPageErrorNotFound,
    props: true
}

export const routes: Array<PSRRouteRecordRaw> = [
    // ROUTE_ERROR_NOT_FOUND,
    ROUTE_HOME
]