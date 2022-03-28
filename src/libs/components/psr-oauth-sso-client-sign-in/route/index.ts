import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";
import PsrLayoutPageSignIn from "../views/PsrOAuthSSOClientSignIn.vue";

export const ROUTE_SIGN_IN_NAME = 'sign-in'
export const ROUTE_SIGN_IN_PATH = '/sign-in'
export const ROUTE_SIGN_IN: PSRRouteRecordRaw = {
    name: ROUTE_SIGN_IN_NAME,
    path: ROUTE_SIGN_IN_PATH,
    component: PsrLayoutPageSignIn,
}

export const routes = [ROUTE_SIGN_IN]