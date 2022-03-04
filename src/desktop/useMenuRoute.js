import {menuItems} from "@/router";
import {provide, reactive, watch} from "vue";
import {User} from "@/services/portal";
import {HOME} from "@/router/desktop";
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
        } else if (item.route === HOME) {
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
        if (store.state.desktop.username === 'platform_admin') {
            return true
        } else if (to.meta.menuItem && to.fullPath !== HOME.path) {
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

    watch(() => store.state.desktop.username, () => {
        asideMenuItems.splice(0, asideMenuItems.length)
        if (store.state.desktop.username === 'platform_admin') {
            asideMenuItems.push(...menuItems)
        } else {
            menuRoutePermission = User.findRoutePermissionByPortalId(process.env.VUE_APP_PORTAL_ID)
            menuRoutePermission.then(permissions => {
                asideMenuItems.push(...filterMenuItemsWithPermissions(menuItems, permissions))
            })
        }
    }, {immediate: true})
}