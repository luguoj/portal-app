import {PsrAppPlugin} from "@/libs/commons/psr/app-context";
import {PsrAppWidget, PsrAppWidgetCatalog} from "@/libs/commons/psr/app-context/widget-manager/types/PsrAppWidget";
import {ref} from "vue";

export class PsrAppWidgetManager extends PsrAppPlugin {
    widgetCatalogRaws: PsrAppWidgetCatalog[]
    widgetByName = ref<Record<string, PsrAppWidget>>({})
    widgetCatalogs = ref<PsrAppWidgetCatalog[]>([])

    constructor(injectKey: string, widgetCatalogs: PsrAppWidgetCatalog[]) {
        super(injectKey)
        this.widgetCatalogRaws = widgetCatalogs
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
                const widget = {
                    ...widgetRaw,
                    name: widgetCatalogRaw.name + '/' + widgetRaw.name
                }
                if (filterWidgetFn(widget)) {
                    filteredWidgetByName[widget.name] = widget
                }
                widgetCatalog.widgets.push(widget)
            }
            if (widgetCatalog.widgets.length > 0) {
                filteredWidgetCatalogs.push(widgetCatalog)
            }
        }
        this.widgetByName.value = filteredWidgetByName
        this.widgetCatalogs.value = filteredWidgetCatalogs
    }
}