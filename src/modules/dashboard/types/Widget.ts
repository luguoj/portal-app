export interface Widget {
    name: string
}

export interface WidgetCatalog {
    name: string,
    title: string,
    widgets: Widget[]
}