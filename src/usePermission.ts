import {computed, provide, Ref, ref, watch} from "vue";
import {userService} from "@/services/portal";
import {ROUTE_PATH_DESKTOP} from "@/router/desktop";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

if (process.env.VUE_APP_PORTAL_ID === undefined) {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const appPortalId: string = process.env.VUE_APP_PORTAL_ID

export function usePermission() {
    let permissionPromise = Promise.resolve<Record<string, string[]>>({})
    const permissions: Ref<Record<string, string[]>> = ref({})
    provide('permissions', permissions)
    // 用户切换则更新许可
    const store = useStore()
    watch(() => store.state.username, () => {
        permissionPromise = userService.findPermissionByPortalId(appPortalId)
        permissionPromise.then(newPermissions => {
            permissions.value = newPermissions
        })
    }, {immediate: true})
    // 判断路由是否满足许可
    const router = useRouter()
    router.beforeEach(to => {
        if (store.state.username === 'platform_admin') {
            return true
        } else if (typeof to.name === 'string' && to.meta.requirePermission && to.fullPath !== ROUTE_PATH_DESKTOP.HOME) {
            const routeName: string = to.name
            return permissionPromise.then(permissions => {
                if (!permissions[routeName]) {
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
    // 判断操作是否满足许可
    provide('checkActionPermission', (routeName: string, actions: string[]) => {
        return computed(() => {
            let flag = true
            const routeActions = permissions.value[routeName]
            for (let i = 0; i < actions.length && flag; i++) {
                const action = actions[i];
                flag = flag && routeActions.includes(action)
            }
            return flag
        })
    })
}