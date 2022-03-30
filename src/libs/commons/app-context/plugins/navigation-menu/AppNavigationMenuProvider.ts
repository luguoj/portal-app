import {AppNavigationMenu} from "./AppNavigationMenu";
import {usePlugin} from "../../usePlugin";

const KEY = 'psr-app-context-navigation-menu'

export function createAppNavigationMenu() {
    return new AppNavigationMenu(KEY)
}

export function useAppNavigationMenu() {
    return usePlugin<AppNavigationMenu>(KEY)
}