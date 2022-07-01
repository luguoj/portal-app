import {PsrAppPermissionUsage} from "@/libs/commons/psr/app-context/permission";
import {ref, watchEffect} from "vue";
import {useAppContext} from "@/libs/commons/psr/app-context/PsrAppContextProvider";

// 创建操作许可标识
export function usePermissionFlag(usage: PsrAppPermissionUsage, key: string, actions?: string[]) {
    const {permission, router} = useAppContext()
    const keyWithLayout = router.current.value?.layout?.name + '/' + key
    const flag = ref<boolean>(false)
    // 判断操作是否满足许可
    watchEffect(() => {
        if (permission.permission.value === 'permit-all') {
            flag.value = true
        } else {
            const grantedActions = permission.permission.value[usage][keyWithLayout]
            let _flag = grantedActions != undefined
            if (_flag && actions != undefined) {
                for (let i = 0; i < actions.length && flag; i++) {
                    const action = actions[i];
                    _flag = _flag && grantedActions.includes(action)
                }
            }
            flag.value = _flag
        }
    })
    return flag
}