import {PsrAppPlugin} from "@/libs/commons/psr/app-context";
import {Widget, WidgetCatalog} from "@/modules/dashboard/types/Widget";

export class PsrDashboardWidgetManager extends PsrAppPlugin {
    widgetCatalogs: WidgetCatalog[]
    widgetByName: Record<string, Widget> = {}

    constructor(injectKey: string, widgetCatalogs: WidgetCatalog[]) {
        super(injectKey)
        this.widgetCatalogs = widgetCatalogs
        for (const widgetCatalog of widgetCatalogs) {
            for (const widget of widgetCatalog.widgets) {
                this.widgetByName[widgetCatalog.name + '/' + widget.name] = widget
            }
        }
    }
}