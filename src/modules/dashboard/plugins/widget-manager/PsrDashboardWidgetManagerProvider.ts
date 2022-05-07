import {usePlugin} from "@/libs/commons/psr/app-context/usePlugin";
import {PsrDashboardWidgetManager} from "@/modules/dashboard/plugins/widget-manager/PsrDashboardWidgetManager";
import {PsrDashboardWidgetCatalog} from "@/modules/dashboard/types/PsrDashboardWidget";

export const KEY = 'psr-app-context-dashboard-widget-manager'

export function createDashboardWidgetManager(options: { widgets: PsrDashboardWidgetCatalog[] }) {
    return new PsrDashboardWidgetManager(KEY, options.widgets)
}

export function useDashboardWidgetManager() {
    return usePlugin<PsrDashboardWidgetManager>(KEY)
}