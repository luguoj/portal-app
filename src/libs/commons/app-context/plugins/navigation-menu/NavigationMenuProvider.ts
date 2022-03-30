import {inject} from "vue";
import {NavigationMenu} from "./NavigationMenu";

const KEY = 'psr-navigation-menu'
export function createNavigationMenu() {
    return new NavigationMenu(KEY)
}
export function useNavigationMenu() {
    return inject(KEY) as NavigationMenu;
}