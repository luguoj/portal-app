import {inject} from "vue";
import {AppPermission, PermissionPromise} from "./AppPermission";

const APP_PERMISSION_KEY = 'psr-app-context-permission'

export function useAppPermission() {
    return inject(APP_PERMISSION_KEY) as AppPermission
}

export function createAppPermission(options: {
    service: (username: string) => PermissionPromise
}) {
    return new AppPermission(APP_PERMISSION_KEY, options.service)
}