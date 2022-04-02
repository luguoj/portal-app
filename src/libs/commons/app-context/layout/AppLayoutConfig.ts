import {AppModuleConfig} from "../module/AppModuleConfig";
import {Module} from "vuex";
import {Component} from "vue";
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";
import {AppNavigationMenuItemRaw} from "psr-app-context/plugins/navigation-menu";

export interface AppLayoutConfig {
    name: string,
    path?: string,
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
