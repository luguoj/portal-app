import {PsrAppRouteChangeEvent, PsrAppRouteError} from "./route";
import {PsrAppContext} from "./PsrAppContext";

export function processSignInRoute(event: PsrAppRouteChangeEvent, context: PsrAppContext) {
    if (event.oldRoute.route.matched.length > 0) {
        if (event.newRoute.route.name === 'sign-in') {
            if (context.token?.getPrincipal().state === 'authenticated') {
                throw new PsrAppRouteError("用户已认证，无需登录")
            }
        }
    } else {
        if (event.newRoute.route.name === 'sign-in') {
            if (context.token?.getPrincipal().state === 'authenticated') {
                throw new PsrAppRouteError("用户已认证，无需登录", context.routePathHangupBySignIn)
            }
        }
    }
}