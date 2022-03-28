import {Module} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router";
import {NavigationMenuItemRaw} from "@/libs/commons/navigation-menu/NavigationMenuItemRaw";

export interface ModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>,
    menus?: NavigationMenuItemRaw[]
}