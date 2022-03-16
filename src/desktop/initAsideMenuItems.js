import {ROUTE_NAME_DESKTOP} from "@/router/desktop";
import {reactive, watch, inject} from "vue";
import {useStore} from "vuex";
import {ASIDE_MENU_ITEMS} from "@/desktop/AsideMenuItems";

function filterMenuItemsWithPermissions(menuItems, permissions) {
    return menuItems.map(item => {
        if (item.children && item.children.length > 0) {
            const newChildren = filterMenuItemsWithPermissions(item.children, permissions)
            if (newChildren.length === 0) {
                return null
            } else {
                return {
                    ...item,
                    children: newChildren
                }
            }
        } else if (
            item.route
            && item.route.meta
            && item.route.meta.requirePermission
            && permissions.indexOf(item.route.name) >= 0
        ) {
            return {...item}
        } else if (
            item.route.name === ROUTE_NAME_DESKTOP.HOME
        ) {
            return {...item}
        }
        return null
    }).filter(item => item != null)
}


export function initAsideMenuItems() {
    const store = useStore()
    const asideMenuItems = reactive([])
    const permissions = inject('permissions')
    watch(permissions, () => {
        asideMenuItems.splice(0, asideMenuItems.length)
        if (store.state.username === 'platform_admin') {
            asideMenuItems.push(...ASIDE_MENU_ITEMS)
        } else {
            asideMenuItems.push(...filterMenuItemsWithPermissions(ASIDE_MENU_ITEMS, permissions))
        }
    }, {immediate: true})
    return asideMenuItems;
}