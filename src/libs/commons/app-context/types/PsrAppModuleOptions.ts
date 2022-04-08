import {Module} from "vuex";
import {PsrAppNavigationMenuItemRaw} from "../navigation-menu";
import {PsrAppRouteRecordRaw} from "../route";


export interface PsrAppModuleOptions {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PsrAppRouteRecordRaw>,
    menus?: PsrAppNavigationMenuItemRaw[]
}


