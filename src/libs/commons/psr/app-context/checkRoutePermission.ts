import {PsrAppRouteChangeEvent, PsrAppRouteError} from "./route";
import {ElMessage} from "element-plus/es";
import {watch} from "vue";
import {PsrAppPermissionRaw} from "./permission";
import {RouteLocationNormalizedLoaded} from "vue-router";
import {PsrAppContext} from "./PsrAppContext";

export function checkRoutePermission(event: PsrAppRouteChangeEvent, context: PsrAppContext) {
    const {layout, route} = event.newRoute
    const from = event.oldRoute.route
    const username = context.permission.username
    const permissionByKey = context.permission.permission.value
    if (layout !== null && route !== null) {
        if (layout.name !== 'root') {
            const layoutKey = layout.meta.permissions ? layout.name : ''
            const routeKey = route.meta.permissions ? route.name : ''
            if (layoutKey || routeKey) {
                if (username === '') {
                    context.routePathHangupBySignIn = route.path
                    throw new PsrAppRouteError(`路由许可校验失败,禁止匿名用户访问,挂起路由${route.path}=>跳转登录`, '/sign-in')
                }
                if (!context.permission.initialized.value) {
                    ElMessage({
                        showClose: true,
                        message: '获取授权中.',
                        type: 'info',
                    })
                    context.routePathHangupBySignIn = route.path
                    throw new PsrAppRouteError(
                        "许可初始化中,挂起路由:" + route.fullPath,
                        new Promise(resolve => {
                            const unWatch = watch(context.permission.initialized, initialized => {
                                if (initialized) {
                                    unWatch()
                                    console.log('许可初始化完毕,恢复路由:%s', route.fullPath)
                                    checkPermissionByKey(permissionByKey, from, layoutKey, routeKey)
                                    resolve(true)
                                }
                            })
                        })
                    )
                } else {
                    checkPermissionByKey(permissionByKey, from, layoutKey, routeKey)
                }
            }
        }
    }
}

function checkPermissionByKey(permissionByKey: PsrAppPermissionRaw, from: RouteLocationNormalizedLoaded, layoutKey?: string, routeKey?: string | symbol | null) {
    let flag = true
    if (permissionByKey !== 'permit-all') {
        if (layoutKey) {
            console.log('布局许可校验:%s', layoutKey)
            flag = flag && !!permissionByKey.route[layoutKey]
        }
        if (routeKey) {
            console.log('路由许可校验:%s', routeKey)
            flag = flag && !!permissionByKey.route[routeKey]
        }
        if (!flag) {
            ElMessage({
                showClose: true,
                message: '无权访问此页面.',
                type: 'error',
            })
            if (from.matched.length == 0 || from.matched[0].meta.layout !== true) {
                throw new PsrAppRouteError("许可校验失败=>跳转到根路由", '/')
            } else {
                throw new PsrAppRouteError("许可校验失败=>阻断路由")
            }
        }
    }
}