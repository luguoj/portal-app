import {Module} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";
import {NavigationMenuItemRaw} from "@/libs/commons/navigation-menu/NavigationMenuItemRaw";

export interface ModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>,
    menus?: NavigationMenuItemRaw[]
}