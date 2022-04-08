import {ref, Ref, watchEffect} from "vue";
import {PsrAppPermissionService} from "./types/PsrAppPermissionService";
import {PsrAppPermissionRaw} from "./types/PsrAppPermissionRaw";

export const DenyAll: PsrAppPermissionRaw = {}
export const PermitAll: PsrAppPermissionRaw = {'permit-all': []}

export class PsrAppPermission {
    readonly permission: Ref<Promise<PsrAppPermissionRaw>> = ref(Promise.resolve(DenyAll))
    private readonly _permissionService: PsrAppPermissionService

    constructor(permissionService: PsrAppPermissionService) {
        this._permissionService = permissionService
    }

    changeUser(username: string) {
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