import {watch} from "vue";
import {NavigationMenuItemRaw} from "./plugins/navigation-menu";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";
import {AppContext, PermissionByRouteName, PermitAll} from "@/libs/commons/app-context/index";

function filterMenuItemsWithPermissions(allMenuItems: NavigationMenuItemRaw[], permissionByRouteName: PermissionByRouteName) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissionByRouteName[item.route.name as string])
}

export function filterNavigationMenuByPermission({navigationMenuRaw, navigationMenu, permission}: AppContext) {
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