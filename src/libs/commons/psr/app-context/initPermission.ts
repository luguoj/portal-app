import {PsrAppContext} from "./PsrAppContext";

export function initPermission(username: string, context: PsrAppContext) {
    return context.permission.changeUser(username).then(permissionByKey => {
        if (permissionByKey) {
            console.log('更新许可=>过滤导航菜单', permissionByKey)
            if (permissionByKey === 'permit-all') {
                context.navigationMenu.doFilter(() => true, () => true)
                context.widget.doFilter(() => true)
            } else {
                context.navigationMenu.doFilter(
                    item => !!permissionByKey.route[item.name],
                    item => {
                        return !!item.route?.meta?.permissions && !!permissionByKey.route[item.route.name]
                    }
                )
                context.widget.doFilter((item => !!permissionByKey.widget[item.name]))
            }
        }
    })
}