import {useStore} from "vuex";
import {useNavigationMenuItems} from "@/libs/commons/navigation-menu/NavigationMenuProvider";
import {inject, provide, Ref, ref, watch} from "vue";
import {NavigationMenuItem} from "@/libs/commons/navigation-menu";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";

function filterMenuItemsWithPermissions(allMenuItems: NavigationMenuItem[], permissions: Record<string, string[]>) {
    return filterFromBottom(allMenuItems, item => !!item.route?.meta?.permission && !!permissions[item.route.name as string])
}

const ASIDE_MENU_ITEMS_KEY = 'asideMenuItems'

export function provideAsideMenuItems() {
    const store = useStore()
    const allNavigationMenuItems = useNavigationMenuItems();
    const navigationMenuItems = ref<NavigationMenuItem[]>([])
    const permissions = inject('permissions') as Ref<Record<string, string[]>>
    watch(permissions, () => {
        navigationMenuItems.value = []
        if (store.state.username === 'platform_admin') {
            navigationMenuItems.value = allNavigationMenuItems
        } else {
            navigationMenuItems.value = filterMenuItemsWithPermissions(allNavigationMenuItems, permissions.value)
        }
    }, {immediate: true})
    provide(ASIDE_MENU_ITEMS_KEY, navigationMenuItems)
}

export function useAsideMenuItems(){
    return inject(ASIDE_MENU_ITEMS_KEY) as Ref<NavigationMenuItem[]>
}