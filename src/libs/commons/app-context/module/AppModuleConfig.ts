import {Module} from "vuex";
import {PSRRouteRecordRaw} from "psr-app-context/route";
import {AppNavigationMenuItemRaw} from "../navigation-menu/AppNavigationMenuItemRaw";


export interface AppModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>,
    menus?: AppNavigationMenuItemRaw[]
}


