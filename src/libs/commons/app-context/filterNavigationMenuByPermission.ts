import {watch} from "vue";
import {AppNavigationMenu} from "./navigation-menu";
import {AppPermission, PermitAll} from "./permission";

export function filterNavigationMenuByPermission(
    navigationMenu: AppNavigationMenu,
    permission: AppPermission
) {
    watch(() => permission.permission.value, permissionValue => {
        permissionValue.then(permissionByRouteName => {
            if (permissionByRouteName === PermitAll) {
                navigationMenu.doFilter(() => true)
            } else {
                navigationMenu.doFilter(item => !!item.route?.meta?.permission && !!permissionByRouteName[item.route.meta.permission.key])
            }
        })
    }, {immediate: true})
}