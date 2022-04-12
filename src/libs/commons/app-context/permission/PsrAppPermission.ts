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
    usePermissionFlag(routeName: string, actions?: string[]) {
        const flag = ref<boolean>(false)
        // 判断操作是否满足许可
        watchEffect(() => {
            this.permission.value.then(permissionByRouteName => {
                if (permissionByRouteName === PermitAll) {
                    flag.value = true
                } else {
                    const routeActions = permissionByRouteName[routeName]
                    let _flag = routeActions != undefined
                    if (_flag && actions != undefined) {
                        for (let i = 0; i < actions.length && flag; i++) {
                            const action = actions[i];
                            _flag = _flag && routeActions.includes(action)
                        }
                    }
                    flag.value = _flag
                }
            })
        })
        return flag
    }
}