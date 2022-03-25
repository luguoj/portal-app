import {ROUTE_HOME} from "@/router/desktop";
import {watch, inject, Ref, ref, provide} from "vue";
import {useStore} from "vuex";
import {
    buildMenuItems,
    MenuItem,
    MenuItemRaw
} from "@/navigation-menu/NavigationMenuItem";
import {ROUTE_ADMIN_GROUP, ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_USER} from "@/router/admin";
import {ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT} from "@/router/sample-pages";
import {filterFromBottom} from "@/modules/utils/array-tree";

const NAVIGATION_MENU_ITEMS: MenuItemRaw[] = [{
    id: 'desktop',
    route: ROUTE_HOME
}, {
    id: 'admin',
    title: '门户管理',
    iconCls: 'pi pi-cog',
    children: [{
        id: 'admin-permission',
        route: ROUTE_ADMIN_PERMISSION
    }, {
        id: 'admin-group',
        route: ROUTE_ADMIN_GROUP
    }, {
        id: 'admin-user',
        route: ROUTE_ADMIN_USER
    }]
}, {
    id: 'sample-pages',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        id: 'sample',
        title: '样例',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE
    }, {
        id: 'sample-parent',
        title: '嵌套页面',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_PARENT
    }, {
        id: 'sample-2',
        title: '样例-2',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_2
    }]
}]

function filterMenuItemsWithPermissions(allMenuItems: MenuItem[], permissions: Record<string, string[]>) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissions[item.route.name])
}

export function useNavigationMenu() {
    const store = useStore()
    const allNavigationMenuItems = buildMenuItems(NAVIGATION_MENU_ITEMS)
    const navigationMenuItems = ref<MenuItem[]>([])
    const permissions = inject('permissions') as Ref<Record<string, string[]>>
    watch(permissions, () => {
        navigationMenuItems.value = []
        if (store.state.username === 'platform_admin') {
            navigationMenuItems.value = allNavigationMenuItems
        } else {
            navigationMenuItems.value = filterMenuItemsWithPermissions(allNavigationMenuItems, permissions.value)
        }
    }, {immediate: true})
    provide('allNavigationMenuItems', allNavigationMenuItems)
    provide('navigationMenuItems', navigationMenuItems)
}

