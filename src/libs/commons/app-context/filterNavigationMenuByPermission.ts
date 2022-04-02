import {watch} from "vue";
import {AppNavigationMenu, AppNavigationMenuItemRaw} from "./plugins/navigation-menu";
import {AppPermission, PermissionsByKey, PermitAll} from "./plugins/permission";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";

function filterMenuItemsWithPermissions(allMenuItems: AppNavigationMenuItemRaw[], permissionsByKey: PermissionsByKey) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissionsByKey[item.route.meta.permission.key])
}

export function filterNavigationMenuByPermission(
    navigationMenuRaw: Record<string, AppNavigationMenuItemRaw[]>,
    navigationMenu: AppNavigationMenu,
    permission: AppPermission
) {
    watch(() => permission.permission.value, permissionValue => {
        navigationMenu.menuItems.value = {}
        permissionValue.then(permissionByRouteName => {
            if (permissionByRouteName === PermitAll) {
                navigationMenu.update(navigationMenuRaw)
            } else {
                const filteredNavigationMenuRaw: Record<string, AppNavigationMenuItemRaw[]> = {}
                for (const layoutName in navigationMenuRaw) {
                    filteredNavigationMenuRaw[layoutName] = filterMenuItemsWithPermissions(navigationMenuRaw[layoutName], permissionByRouteName)
                }
                navigationMenu.update(filteredNavigationMenuRaw)
            }
        })
    }, {immediate: true})
}