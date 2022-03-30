import {watch} from "vue";
import {NavigationMenu, NavigationMenuItem} from "@/libs/commons/navigation-menu/index";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";
import {AppContext, PermissionByRouteName, PermitAll} from "@/libs/commons/app-context";

function filterMenuItemsWithPermissions(allMenuItems: NavigationMenuItem[], permissionByRouteName: PermissionByRouteName) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissionByRouteName[item.route.name as string])
}

export function filterByPermission(navigationMenu: NavigationMenu, appContext: AppContext) {
    watch(() => appContext.permission.permission.value, permission => {
        navigationMenu.menuItems.value = []
        permission.then(permissionByRouteName => {
            if (permissionByRouteName === PermitAll) {
                navigationMenu.menuItems.value = navigationMenu.allMenuItems
            } else {
                navigationMenu.menuItems.value = filterMenuItemsWithPermissions(navigationMenu.allMenuItems, permissionByRouteName)
            }
        })
    }, {immediate: true})
}