import {menuItems} from "@/router";
import {provide, reactive, watch} from "vue";
import {userService} from "@/services/portal";
import {ROUTE_NAME_DESKTOP, ROUTE_PATH_DESKTOP} from "@/router/desktop";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";

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
        } else if (item.route && permissions.indexOf(item.id) >= 0) {
            return {...item}
        } else if (item.route.name === ROUTE_NAME_DESKTOP.HOME) {
            return {...item}
        }
        return null
    }).filter(item => item != null)
}

export function useMenuRoute() {
    const store = useStore()
    const router = useRouter()
    const asideMenuItems = reactive([])
    provide('asideMenuItems', asideMenuItems)

    let menuRoutePermission = Promise.resolve([])
    router.beforeEach(to => {
        if (store.state.username === 'platform_admin') {
            return true
        } else if (to.meta.menuItem && to.fullPath !== ROUTE_PATH_DESKTOP.HOME) {
            return menuRoutePermission.then(permissions => {
                if (permissions.indexOf(to.meta.menuItem.id) < 0) {
                    ElMessage({
                        showClose: true,
                        message: '无权访问此页面.',
                        type: 'error',
                    })
                    return false
                }
                return true
            })
        }
    })

    watch(() => store.state.username, () => {
        asideMenuItems.splice(0, asideMenuItems.length)
        if (store.state.username === 'platform_admin') {
            asideMenuItems.push(...menuItems)
        } else {
            menuRoutePermission = userService.findRoutePermissionByPortalId(process.env.VUE_APP_PORTAL_ID)
            menuRoutePermission.then(permissions => {
                asideMenuItems.push(...filterMenuItemsWithPermissions(menuItems, permissions))
            })
        }
    }, {immediate: true})
}