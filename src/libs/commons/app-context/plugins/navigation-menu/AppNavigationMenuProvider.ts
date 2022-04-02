import {AppNavigationMenu} from "./AppNavigationMenu";
import {usePlugin} from "../../usePlugin";
import {computed} from "vue";
import {useAppContext} from "psr-app-context/";

const KEY = 'psr-app-context-navigation-menu'

export function createAppNavigationMenu() {
    return new AppNavigationMenu(KEY)
}

export function useAppNavigationMenu() {
    return usePlugin<AppNavigationMenu>(KEY)
}

export function useLayoutNavigationMenuItems() {
    const {meta: layoutMeta} = useAppContext().currentLayout
    return computed(() => {
        if (layoutMeta.value) {
            return useAppNavigationMenu().menuItems.value[layoutMeta.value.name]
        } else {
            return [] as AppNavigationMenu[]
        }
    })
}