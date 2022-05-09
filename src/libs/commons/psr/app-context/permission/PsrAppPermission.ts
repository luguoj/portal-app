import {Ref, ref} from "vue";
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
}