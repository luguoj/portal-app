import {Component} from "vue";

export interface PsrAppWidget {
    name: string,
    title: string,
    iconCls?: string,
    thumbnailCls?: string,
    component: Component,
    permissions: string[] | false,
    nameRaw: string
}

export interface PsrAppWidgetCatalog {
    name: string,
    title: string,
    iconCls?: string,
    widgets: PsrAppWidget[]
}