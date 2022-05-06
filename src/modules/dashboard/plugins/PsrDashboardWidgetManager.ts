import {PsrAppPlugin} from "@/libs/commons/psr/app-context";
import {PsrDashboardWidget, PsrDashboardWidgetCatalog} from "@/modules/dashboard/types/PsrDashboardWidget";

export class PsrDashboardWidgetManager extends PsrAppPlugin {
    widgetCatalogs: PsrDashboardWidgetCatalog[]
    widgetByName: Record<string, PsrDashboardWidget> = {}

    constructor(injectKey: string, widgetCatalogs: PsrDashboardWidgetCatalog[]) {
        super(injectKey)
        this.widgetCatalogs = widgetCatalogs
        for (const widgetCatalog of widgetCatalogs) {
            for (const widget of widgetCatalog.widgets) {
                this.widgetByName[widgetCatalog.name + '/' + widget.name] = widget
            }
        }
    }
}