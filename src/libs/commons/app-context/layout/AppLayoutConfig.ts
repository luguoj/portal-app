import {AppModuleConfig} from "../module/AppModuleConfig";
import {Module} from "vuex";
import {Component} from "vue";
import {PSRRouteRecordRaw} from "@/libs/commons/app-context/route";
import {AppNavigationMenuItemRaw} from "@/libs/commons/app-context/navigation-menu";

export interface AppLayoutConfig {
    name: string,
    title: string,
    iconCls: string,
    store?: Module<any, any>,
    component: Component,
    modules?: AppModuleConfig[]
    default?: boolean,
    permission?: boolean
    routes?: PSRRouteRecordRaw[]
    menus?: AppNavigationMenuItemRaw[]
}
