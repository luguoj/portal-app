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
        const _widgetByName: Record<string, PsrAppWidget> = {}
        const _widgetCatalogs: PsrAppWidgetCatalog[] = []
        for (const widgetCatalogRaw of this.widgetCatalogRaws) {
            const widgetCatalog: PsrAppWidgetCatalog = {
                ...widgetCatalogRaw,
                widgets: []
            }
            for (const widget of widgetCatalog.widgets) {
                if (filterWidgetFn(widget)) {
                    _widgetByName[widgetCatalog.name + '/' + widget.name] = widget
                }
                widgetCatalog.widgets.push(widget)
            }
            if (widgetCatalog.widgets.length > 0) {
                _widgetCatalogs.push(widgetCatalog)
            }
        }
        this.widgetByName.value = _widgetByName
        this.widgetCatalogs.value = _widgetCatalogs
    }
}