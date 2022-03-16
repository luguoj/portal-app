import {computed, provide,  ref, watch} from "vue";
import {userService} from "@/services/portal";
import {ROUTE_PATH_DESKTOP} from "@/router/desktop";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";


export function usePermission() {
    let permissionPromise = Promise.resolve([])
    const permissions = ref({})
    const store = useStore()
    watch(() => store.state.username, () => {
        permissionPromise = userService.findPermissionByPortalId(process.env.VUE_APP_PORTAL_ID)
        permissionPromise.then(newPermissions => {
            permissions.value = newPermissions
        })
    }, {immediate: true})
    provide('permissions', permissions)

    const router = useRouter()
    router.beforeEach(to => {
        if (store.state.username === 'platform_admin') {
            return true
        } else if (to.meta.requirePermission && to.fullPath !== ROUTE_PATH_DESKTOP.HOME) {
            return permissionPromise.then(permissions => {
                if (!permissions[to.name]) {
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
    provide('checkActionPermission', (routeName, actions) => {
        return computed(() => permissions[routeName].includes(actions))
    })
}