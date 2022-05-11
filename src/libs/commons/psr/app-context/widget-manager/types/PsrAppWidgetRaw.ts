import {Component} from "vue";

export interface PsrAppWidgetRaw {
    name: string,
    title: string,
    iconCls?: string,
    component: Component,
    permissions: string[] | false
}

export interface PsrAppWidgetCatalogRaw {
    name: string,
    title: string,
    iconCls?: string,
    widgets: PsrAppWidgetRaw[]
}