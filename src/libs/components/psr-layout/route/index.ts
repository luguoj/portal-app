import PsrLayoutPageBlank from "@/libs/components/psr-layout/views/page/blank/PsrLayoutPageBlank.vue";
import PsrLayoutPageErrorNotFound from "@/libs/components/psr-layout/views/page/error/PsrLayoutPageErrorNotFound.vue";
import PsrLayoutPageSignIn from "@/libs/components/psr-layout/views/page/sign-in/PsrLayoutPageSignIn.vue";
import {PSRRouteRecordRaw} from "@/libs/commons/router/RouteRecordRaw";

export const ROUTE_NAME_DESKTOP = {
    HOME: 'home',
    SIGN_IN: 'sign-in',
    ERROR_NOT_FOUND: 'error-not-found',
    INITIALIZING: 'initializing'
}
export const ROUTE_PATH_DESKTOP = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    ERROR_NOT_FOUND: '/:pathMatch(.*)*',
    INITIALIZING: '/initializing'
}
export const HOME_TITLE = '首页'
export const HOME_ICON_CLASS = 'pi pi-home'
export const ROUTE_HOME: PSRRouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.HOME,
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

export const ROUTE_SIGN_IN: PSRRouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.SIGN_IN,
    path: ROUTE_PATH_DESKTOP.SIGN_IN,
    component: PsrLayoutPageSignIn,
}

export const ROUTE_ERROR_NOT_FOUND: PSRRouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.ERROR_NOT_FOUND,
    path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
    component: PsrLayoutPageErrorNotFound,
    props: true
}

export const routes: Array<PSRRouteRecordRaw> = [ROUTE_HOME, ROUTE_SIGN_IN, ROUTE_ERROR_NOT_FOUND]