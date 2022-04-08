import {ref, Ref, watchEffect} from "vue";

export type PermissionsByKey = Record<string | symbol, string[]>
export type PermissionPromise = Promise<PermissionsByKey>
export const DenyAll: PermissionsByKey = {}
export const PermitAll: PermissionsByKey = {'permit-all': []}

export class AppPermission {
    readonly permission: Ref<PermissionPromise> = ref(Promise.resolve(DenyAll))
    private readonly _permissionService: (username: string) => PermissionPromise

    constructor(permissionService: (username: string) => PermissionPromise) {
        this._permissionService = permissionService
    }

    update(username: string) {
        this.permission.value = this._permissionService(username)
    }

    // 创建操作许可标识
    useActionPermissionFlag(routeName: string, actions: string[]) {
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