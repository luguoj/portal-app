import {Module} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";
import {AppNavigationMenuItemRaw} from "../plugins/navigation-menu/AppNavigationMenuItemRaw";


export interface AppModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>,
    menus?: AppNavigationMenuItemRaw[]
}


