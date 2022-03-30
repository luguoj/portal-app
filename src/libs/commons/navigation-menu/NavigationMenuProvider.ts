import {inject} from "vue";
import {NavigationMenuItemRaw} from "./NavigationMenuItemRaw";
import {NavigationMenu} from "./NavigationMenu";

const KEY = 'psr-navigation-menu'


export function createNavigationMenu(options: { menus: NavigationMenuItemRaw[] }) {
    return new NavigationMenu(KEY, options.menus)
}

export function useNavigationMenu(): NavigationMenu {
    return inject(KEY) as NavigationMenu;
}