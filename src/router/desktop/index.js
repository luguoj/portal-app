import DesktopViewBlank from "@/desktop/view/blank/DesktopViewBlank";
import DesktopViewErrorNotFound from "@/desktop/view/error/DesktopViewErrorNotFound";
import DesktopViewSignIn from "@/desktop/view/sign-in/DesktopViewSignIn";

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
export const ROUTE_HOME = {
    name: ROUTE_NAME_DESKTOP.HOME,
    path: ROUTE_PATH_DESKTOP.HOME,
    component: DesktopViewBlank,
    meta: {
        isAffix: true,
        title: HOME_TITLE,
        iconCls: HOME_ICON_CLASS
    }
}

export const ROUTE_SIGN_IN = {
    name: ROUTE_NAME_DESKTOP.SIGN_IN,
    path: ROUTE_PATH_DESKTOP.SIGN_IN,
    component: DesktopViewSignIn,
}

export const ROUTE_ERROR_NOT_FOUND = {
    name: ROUTE_NAME_DESKTOP.ERROR_NOT_FOUND,
    path: ROUTE_PATH_DESKTOP.ERROR_NOT_FOUND,
    component: DesktopViewErrorNotFound,
    props: true
}

export const ROUTES_DESKTOP = [ROUTE_HOME, ROUTE_SIGN_IN, ROUTE_ERROR_NOT_FOUND]