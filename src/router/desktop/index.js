import DesktopViewBlank from "@/desktop/view/blank/DesktopViewBlank";
import DesktopViewErrorNotFound from "@/desktop/view/error/DesktopViewErrorNotFound";
import DesktopViewSignIn from "@/desktop/view/sign-in/DesktopViewSignIn";
import DesktopViewInitializing from "@/desktop/view/initializing/DesktopViewInitializing";

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

export function routeHome() {
    return {
        name: ROUTE_NAME_DESKTOP.HOME,
        path: ROUTE_PATH_DESKTOP.HOME,
        component: DesktopViewBlank,
        meta: {
            isAffix: true,
            title: HOME_TITLE,
            iconCls: HOME_ICON_CLASS
        }
    }
}

export function routeSignIn() {
    return {
        name: ROUTE_NAME_DESKTOP.SIGN_IN,
        path: ROUTE_PATH_DESKTOP.SIGN_IN,
        component: DesktopViewSignIn
    }
}

export function routeErrorNotFound() {
    return {
        name: ROUTE_NAME_DESKTOP.ERROR_NOT_FOUND,
        path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
        component: DesktopViewErrorNotFound,
        props: true
    }
}

export function routeInitializing() {
    return {
        name: ROUTE_NAME_DESKTOP.INITIALIZING,
        path: ROUTE_PATH_DESKTOP.INITIALIZING,
        component: DesktopViewInitializing
    }
}

export function routesDesktop() {
    return [routeHome(), routeSignIn(), routeErrorNotFound(), routeInitializing()]
}