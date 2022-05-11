import {defineAsyncComponent} from "vue";
import {PsrAppWidgetCatalog} from "@/libs/commons/psr/app-context/widget-manager/types/PsrAppWidget";

export const widgets: PsrAppWidgetCatalog[] = [{
    name: 'sample/charts',
    title: '样例/图表',
    widgets: [{
        name: 'line',
        title: '折线图',
        component: defineAsyncComponent(() => import("@/modules/sample-page/dashboard-widgets/charts/line/index.vue")),
        permissions: false
    }, {
        name: 'radar',
        title: '雷达图',
        component: defineAsyncComponent(() => import("@/modules/sample-page/dashboard-widgets/charts/radar/index.vue")),
        permissions: false
    }]
}]