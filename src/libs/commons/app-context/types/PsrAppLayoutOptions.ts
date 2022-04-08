import {PsrAppModuleOptions} from "./PsrAppModuleOptions";
import {Module} from "vuex";
import {Component} from "vue";
import {PsrAppNavigationMenuItemRaw} from "../navigation-menu";
import {PsrAppRouteRecordRaw} from "../route";

export interface PsrAppLayoutOptions {
    name: string,
    title: string,
    iconCls: string,
    store?: Module<any, any>,
    component: Component,
    modules?: PsrAppModuleOptions[]
    default?: boolean,
    permission?: boolean
    routes?: PsrAppRouteRecordRaw[]
    menus?: PsrAppNavigationMenuItemRaw[]
}
