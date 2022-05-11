import {PsrAppWidgetCatalogRaw} from "./types/PsrAppWidgetRaw";
import {ref} from "vue";
import {PsrAppWidget, PsrAppWidgetCatalog} from "./types/PsrAppWidget";

export class PsrAppWidgetManager {
    widgetCatalogRaws: PsrAppWidgetCatalog[]
    widgetByName = ref<Record<string, PsrAppWidget>>({})
    widgetCatalogs = ref<PsrAppWidgetCatalog[]>([])

    constructor(widgetCatalogRaws: PsrAppWidgetCatalogRaw[]) {
        this.widgetCatalogRaws = []
        for (const widgetCatalogRaw of widgetCatalogRaws) {
            const widgetCatalog: PsrAppWidgetCatalog = {
                ...widgetCatalogRaw,
                widgets: []
            }
            this.widgetCatalogRaws.push(widgetCatalog)
            for (const widgetRaw of widgetCatalogRaw.widgets) {
                widgetCatalog.widgets.push({
                    ...widgetRaw,
                    name: widgetCatalogRaw.name + '/' + widgetRaw.name,
                    nameRaw: widgetRaw.name
                })
            }
        }
        this.doFilter(() => false)
    }

    doFilter(filterWidgetFn: (widget: PsrAppWidget) => boolean) {
        const filteredWidgetByName: Record<string, PsrAppWidget> = {}
        const filteredWidgetCatalogs: PsrAppWidgetCatalog[] = []
        for (const widgetCatalogRaw of this.widgetCatalogRaws) {
            const widgetCatalog: PsrAppWidgetCatalog = {
                ...widgetCatalogRaw,
                widgets: []
            }
            for (const widgetRaw of widgetCatalogRaw.widgets) {
                if (filterWidgetFn(widgetRaw)) {
                    filteredWidgetByName[widgetRaw.name] = widgetRaw
                }
                widgetCatalog.widgets.push(widgetRaw)
            }
            if (widgetCatalog.widgets.length > 0) {
                filteredWidgetCatalogs.push(widgetCatalog)
            }
        }
        this.widgetByName.value = filteredWidgetByName
        this.widgetCatalogs.value = filteredWidgetCatalogs
    }
}