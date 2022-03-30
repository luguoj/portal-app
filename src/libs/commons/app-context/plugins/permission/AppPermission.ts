import {App, ref, Ref, watch, watchEffect} from "vue";
import {ElMessage} from "element-plus";
import {AppContext, AppPlugin} from "@/libs/commons/app-context";

export type PermissionByRouteName = Record<string | symbol, string[]>
export type PermissionPromise = Promise<PermissionByRouteName>
export const DenyAll: PermissionByRouteName = {}
export const PermitAll: PermissionByRouteName = {'permit-all': []}

export class AppPermission implements AppPlugin {
    readonly injectKey: string
    readonly permission: Ref<PermissionPromise> = ref(Promise.resolve(DenyAll))
    private readonly _permissionService: (username: string) => PermissionPromise

    constructor(injectKey: string, permissionService: (username: string) => PermissionPromise) {
        this.injectKey = injectKey
        this._permissionService = permissionService
    }

    install(app: App, appContext: AppContext) {
        app.provide(this.injectKey, this)
        // 通过许可控制路由跳转
        appContext.router.beforeEach(to => {
            if (to.meta.requirePermission) {
                const routeName = to.name!
                return this.permission.value.then(permissionByRouteName => {
                    if (permissionByRouteName !== PermitAll
                        && !permissionByRouteName[routeName]) {
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
        // 用户切换时重新获取许可
        watch(() => appContext.store.state.username, () => {
            this.permission.value = this._permissionService(appContext.store.state.username)
        }, {immediate: true})
    }

    // 创建操作许可标识
    createActionPermissionFlag(routeName: string, actions: string[]) {
        const flag = ref(false)
        // 判断操作是否满足许可
        watchEffect(() => {
            this.permission.value.then(permissionByRouteName => {
                const routeActions = permissionByRouteName[routeName]
                let _flag = true
                for (let i = 0; i < actions.length && flag; i++) {
                    const action = actions[i];
                    _flag = _flag && routeActions.includes(action)
                }
                flag.value = _flag
            })
        })
    }
}