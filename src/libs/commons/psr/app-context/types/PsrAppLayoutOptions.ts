import {PsrAppModuleOptions} from "./PsrAppModuleOptions";
import {Module} from "vuex";
import {Component} from "vue";
import {PsrAppNavigationMenuItemsRaw} from "../navigation-menu";
import {PsrAppRouteRecordRaw} from "../route";

export interface PsrAppLayoutOptions {
    name: string,
    title: string,
    iconCls: string,
    store?: Module<any, any>,
    component: Component,
    modules?: PsrAppModuleOptions[]
    permissions: string[] | false
    routes?: PsrAppRouteRecordRaw[]
    menus?: PsrAppNavigationMenuItemsRaw,
}
