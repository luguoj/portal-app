import {usePlugin} from "@/libs/commons/psr/app-context/usePlugin";
import {PsrAppWidgetManager} from "@/libs/commons/psr/app-context/widget-manager/PsrAppWidgetManager";
import {PsrAppWidgetCatalog} from "@/libs/commons/psr/app-context/widget-manager/types/PsrAppWidget";

export const KEY = 'psr-app-context-widget-manager'

export function createWidgetManager(options: { widgets: PsrAppWidgetCatalog[] }) {
    return new PsrAppWidgetManager(KEY, options.widgets)
}

export function useWidgetManager() {
    return usePlugin<PsrAppWidgetManager>(KEY)
}