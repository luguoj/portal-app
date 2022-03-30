import {inject} from "vue";
import {AppNavigationMenu} from "./AppNavigationMenu";

const KEY = 'psr-app-context-navigation-menu'
export function createAppNavigationMenu() {
    return new AppNavigationMenu(KEY)
}
export function useAppNavigationMenu() {
    return inject(KEY) as AppNavigationMenu;
}