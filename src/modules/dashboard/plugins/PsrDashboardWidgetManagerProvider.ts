import {usePlugin} from "@/libs/commons/psr/app-context/usePlugin";
import {PsrDashboardWidgetManager} from "@/modules/dashboard/plugins/PsrDashboardWidgetManager";
import {WidgetCatalog} from "@/modules/dashboard/types/Widget";

export const KEY = 'psr-app-context-dashboard-widget-manager'

export function createDashboardWidgetManager(options: { widgets: WidgetCatalog[] }) {
    return new PsrDashboardWidgetManager(KEY, options.widgets)
}

export function useDashboardWidgetManager() {
    return usePlugin<PsrDashboardWidgetManager>(KEY)
}