import DesktopViewBlank from "@/desktop/view/blank/DesktopViewBlank.vue";
import DesktopViewErrorNotFound from "@/desktop/view/error/DesktopViewErrorNotFound.vue";
import DesktopViewSignIn from "@/desktop/view/sign-in/DesktopViewSignIn.vue";
import {RouteRecordRaw} from "vue-router";

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
export const ROUTE_HOME: RouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.HOME,
    path: ROUTE_PATH_DESKTOP.HOME,
    component: DesktopViewBlank,
    meta: {
        isAffix: true,
        title: HOME_TITLE,
        iconCls: HOME_ICON_CLASS
    }
}

export const ROUTE_SIGN_IN: RouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.SIGN_IN,
    path: ROUTE_PATH_DESKTOP.SIGN_IN,
    component: DesktopViewSignIn,
}

export const ROUTE_ERROR_NOT_FOUND: RouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.ERROR_NOT_FOUND,
    path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
    component: DesktopViewErrorNotFound,
    props: true
}

export const ROUTES_DESKTOP: Array<RouteRecordRaw> = [ROUTE_HOME, ROUTE_SIGN_IN, ROUTE_ERROR_NOT_FOUND]