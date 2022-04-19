import {PsrAppRouteChangeEvent, PsrAppRouteError} from "./route";
import {AUTHENTICATED} from "@/libs/services/psr-oauth/context";
import {PsrAppContext} from "./PsrAppContext";

export function processSignInRoute(event: PsrAppRouteChangeEvent, context: PsrAppContext) {
    if (context.routePathHangupBySignIn == null) {
        // 处理初始路由
        if (event.newRoute.route.name === 'sign-in') {
            if (context.token?.tokenInfo().authentication.state === AUTHENTICATED) {
                throw new PsrAppRouteError("用户已认证，无需登录", '/')
            } else {
                console.log('用户未认证，缓存初始路由:/')
                context.routePathHangupBySignIn = '/'
            }
        } else {
            console.log('缓存初始路由:%O', event.newRoute.route.fullPath)
            context.routePathHangupBySignIn = event.newRoute.route.fullPath
        }
    } else if (event.oldRoute.route.matched.length > 0) {
        if (event.newRoute.route.name === 'sign-in') {
            if (context.token?.tokenInfo().authentication.state === AUTHENTICATED) {
                throw new PsrAppRouteError("用户已认证，无需登录")
            } else {
                console.log('用户未认证，挂起源路由地址%O', event.oldRoute.route)
                context.routePathHangupBySignIn = event.oldRoute.route.fullPath
            }
        }
    }
}