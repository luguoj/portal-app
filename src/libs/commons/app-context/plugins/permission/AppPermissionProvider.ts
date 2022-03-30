import {AppPermission, PermissionPromise} from "./AppPermission";
import {usePlugin} from "../../usePlugin";

const KEY = 'psr-app-context-permission'

export function createAppPermission(options: {
    service: (username: string) => PermissionPromise
}) {
    return new AppPermission(KEY, options.service)
}

export function useAppPermission() {
    return usePlugin<AppPermission>(KEY)
}
