import {AppPermission, PermitAll} from "psr-app-context/permission";
import {Router} from "vue-router";
import {PSRRouteMetaPermission} from "psr-app-context/route";
import {ElMessage} from "element-plus/es";

export function blockRouteByPermission(permission: AppPermission, router: Router) {
    // 通过许可控制路由跳转
    router.beforeEach(to => {
        if (to.meta.permission) {
            const {key} = to.meta.permission as PSRRouteMetaPermission
            return permission.permission.value.then(permissionByKey => {
                if (permissionByKey !== PermitAll
                    && !permissionByKey[key]) {
                    ElMessage({
                        showClose: true,
                        message: '无权访问此页面.',
                        type: 'error',
                    })
                    return false
                }
                return true
            })
        }
    })
}