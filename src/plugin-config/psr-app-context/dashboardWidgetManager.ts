import {createDashboardWidgetManager} from "@/modules/dashboard/plugins/widget-manager/PsrDashboardWidgetManagerProvider";
import {defineAsyncComponent} from "vue";

const dashboardWidgetManage = createDashboardWidgetManager({
    widgets: [{
        name: 'sample/charts',
        title: '样例/图表',
        widgets: [{
            name: 'line',
            title: '折线图',
            component: defineAsyncComponent(() => import("@/modules/sample-page/dashboard-widgets/charts/line/index.vue"))
        }, {
            name: 'radar',
            title: '雷达图',
            component: defineAsyncComponent(() => import("@/modules/sample-page/dashboard-widgets/charts/radar/index.vue"))
        }]
    }]
})

export default dashboardWidgetManage