import DesktopViewBlank from "@/desktop/view/blank/DesktopViewBlank";
import DesktopViewErrorNotFound from "@/desktop/view/error/DesktopViewErrorNotFound";
import DesktopViewSignIn from "@/desktop/view/sign-in/DesktopViewSignIn";
import DesktopViewInitializing from "@/desktop/view/initializing/DesktopViewInitializing";

export const HOME = {
    name: 'home',
    path: '/',
    component: DesktopViewBlank,
    meta: {
        isAffix: true,
        title: '首页',
        iconCls: 'pi pi-desktop'
    }
}

export const SIGN_IN = {
    name: 'sign-in',
    path: '/sign-in',
    component: DesktopViewSignIn
}

export const ERROR_NOT_FOUND = {
    name: 'error-not-found',
    path: '/:pathMatch(.*)*',
    component: DesktopViewErrorNotFound,
    props: true
}

export const INITIALIZING = {
    name: 'initializing',
    path: '/initializing',
    component: DesktopViewInitializing
}

export const DESKTOP = [HOME, SIGN_IN, ERROR_NOT_FOUND, INITIALIZING]