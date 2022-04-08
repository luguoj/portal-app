import {AppPermission} from "./permission";
import {Store} from "vuex";
import {StoreRootState} from "./store";
import {watch} from "vue";

export function updatePermissionOnUsernameChange(permission: AppPermission, store: Store<StoreRootState>) {
    // 用户切换时重新获取许可
    watch(() => store.state.username, username => {
        permission.update(username)
    }, {immediate: true})
}