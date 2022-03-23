import {ROUTE_NAME_DESKTOP} from "@/router/desktop";
import {reactive, watch, inject, Ref, ref} from "vue";
import {useStore} from "vuex";
import {ASIDE_MENU_ITEMS, MenuItem} from "@/desktop/AsideMenuItems";

const MenuNotPermitted = {id: 'menu-not-permitted'}

function filterMenuItemsWithPermissions(menuItems: MenuItem[], permissions: Record<string, string[]>): MenuItem[] {
    return menuItems.map(item => {
        if (item.children && item.children.length > 0) {
            const newChildren = filterMenuItemsWithPermissions(item.children, permissions)
            if (newChildren.length > 0) {
                return {
                    ...item,
                    children: newChildren
                }
            }
        } else if (
            item.route
            && item.route.meta
            && item.route.meta.requirePermission
            && typeof item.route.name === 'string'
            && permissions[item.route.name]
        ) {
            return {...item}
        } else if (
            item.route?.name === ROUTE_NAME_DESKTOP.HOME
        ) {
            return {...item}
        }
        return MenuNotPermitted
    }).filter(item => item != MenuNotPermitted)
}


export function initAsideMenuItems() {
    const store = useStore()
    const asideMenuItems = reactive<MenuItem[]>([])
    const permissions = inject<Ref<Record<string, string[]>>>('permissions', ref({}))
    watch(permissions, () => {
        asideMenuItems.splice(0, asideMenuItems.length)
        if (store.state.username === 'platform_admin') {
            asideMenuItems.push(...ASIDE_MENU_ITEMS)
        } else {
            asideMenuItems.push(...filterMenuItemsWithPermissions(ASIDE_MENU_ITEMS, permissions.value))
        }
    }, {immediate: true})
    return asideMenuItems;
}