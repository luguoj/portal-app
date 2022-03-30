import {watch} from "vue";
import {AppNavigationMenu, AppNavigationMenuItemRaw} from "./plugins/navigation-menu";
import {AppPermission, PermissionByRouteName, PermitAll} from "./plugins/permission";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";

function filterMenuItemsWithPermissions(allMenuItems: AppNavigationMenuItemRaw[], permissionByRouteName: PermissionByRouteName) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissionByRouteName[item.route.name as string])
}

export function filterNavigationMenuByPermission(
    navigationMenuRaw: AppNavigationMenuItemRaw[],
    navigationMenu: AppNavigationMenu,
    permission: AppPermission
) {
    watch(() => permission.permission.value, permissionValue => {
        navigationMenu.menuItems.value = []
        permissionValue.then(permissionByRouteName => {
            if (permissionByRouteName === PermitAll) {
                navigationMenu.update(navigationMenuRaw)
            } else {
                const filteredNavigationMenuRaw = filterMenuItemsWithPermissions(navigationMenuRaw, permissionByRouteName)
                navigationMenu.update(filteredNavigationMenuRaw)
            }
        })
    }, {immediate: true})
}