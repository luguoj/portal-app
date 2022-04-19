import {PsrAppContext} from "./PsrAppContext";

export function initPermission(username: string, context: PsrAppContext) {
    context.permission.changeUser(username)?.then(permissionByKey => {
        if (permissionByKey) {
            console.log('更新许可=>过滤导航菜单', permissionByKey)
            if (permissionByKey === 'permit-all') {
                context.navigationMenu.doFilter(() => true, () => true)
            } else {
                context.navigationMenu.doFilter(
                    item => !!permissionByKey[item.name],
                    item => !!item.route?.meta?.permission && !!permissionByKey[item.route.meta.permission.key]
                )
            }
            console.log(context.routePathHangupBySignIn)
            if (context.routePathHangupBySignIn) {
                console.log('许可更新->跳转拦截的路由', context.routePathHangupBySignIn)
                context.router.router.replace({path: context.routePathHangupBySignIn})
            }
        }
    })
}