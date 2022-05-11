import {Component} from "vue";

export interface PsrAppWidget {
    name: string,
    title: string,
    component: Component,
    permissions: string[] | false
}

export interface PsrAppWidgetCatalog {
    name: string,
    title: string,
    widgets: PsrAppWidget[]
}