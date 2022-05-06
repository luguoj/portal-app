import {Component} from "vue";

export interface PsrDashboardWidget {
    name: string,
    component: Component
}

export interface PsrDashboardWidgetCatalog {
    name: string,
    title: string,
    widgets: PsrDashboardWidget[]
}