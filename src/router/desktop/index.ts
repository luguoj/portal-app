import DesktopViewBlank from "@/layout/view/blank/DesktopViewBlank.vue";
import DesktopViewErrorNotFound from "@/layout/view/error/DesktopViewErrorNotFound.vue";
import DesktopViewSignIn from "@/layout/view/sign-in/DesktopViewSignIn.vue";
import {PSRRouteRecordRaw} from "@/router/RouteRecordRaw";

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
    component: DesktopViewBlank,
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
    component: DesktopViewSignIn,
}

export const ROUTE_ERROR_NOT_FOUND: PSRRouteRecordRaw = {
    name: ROUTE_NAME_DESKTOP.ERROR_NOT_FOUND,
    path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
    component: DesktopViewErrorNotFound,
    props: true
}

export const ROUTES_DESKTOP: Array<PSRRouteRecordRaw> = [ROUTE_HOME, ROUTE_SIGN_IN, ROUTE_ERROR_NOT_FOUND]