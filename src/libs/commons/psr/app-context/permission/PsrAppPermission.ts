import {Ref, ref, watchEffect} from "vue";
import {PsrAppPermissionService} from "./types/PsrAppPermissionService";
import {PsrAppPermissionRaw} from "./types/PsrAppPermissionRaw";

export class PsrAppPermission {
    initialized = ref(true)
    permission: Ref<PsrAppPermissionRaw> = ref(PsrAppPermission.denyAll())
    username = ''
    private readonly _permissionService: PsrAppPermissionService

    constructor(permissionService: PsrAppPermissionService) {
        this._permissionService = permissionService
    }

    static denyAll(): PsrAppPermissionRaw {
        return {route: {}, widget: {}}
    }

    changeUser(newUsername: string) {
        const oldUsername = this.username
        this.username = newUsername
        if (newUsername != '') {
            if (oldUsername !== newUsername) {
                this.initialized.value = false
                return this._permissionService(newUsername)
                    .then(newPermission => {
                        if (this.username === newUsername) {
                            this.permission.value = newPermission || PsrAppPermission.denyAll()
                            this.initialized.value = true
                            return newPermission
                        } else {
                            throw new Error("用户切换许可更新请求废弃")
                        }
                    })
                    .catch(() => {
                        throw new Error("获取许可失败")
                    })
            }
        } else {
            if (oldUsername !== newUsername || this.initialized.value == false) {
                this.permission.value = PsrAppPermission.denyAll()
                this.initialized.value = true
            }
        }
        return Promise.resolve(this.permission.value)
    }

    // 创建操作许可标识
    usePermissionFlag(routeName: string, actions?: string[]) {
        const flag = ref<boolean>(false)
        // 判断操作是否满足许可
        watchEffect(() => {
            if (this.permission.value === 'permit-all') {
                flag.value = true
            } else {
                const routeActions = this.permission.value[routeName]
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
        return flag
    }
}