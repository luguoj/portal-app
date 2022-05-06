import {createDashboardWidgetManager} from "@/modules/dashboard/plugins/PsrDashboardWidgetManagerProvider";
import {defineAsyncComponent} from "vue";

const dashboardWidgetManage = createDashboardWidgetManager({
    widgets: [{
        name: 'sample/charts',
        title: 'sample/charts',
        widgets: [{
            name: 'radar',
            component: defineAsyncComponent(() => import("@/modules/sample-page/dashboard-widgets/charts/radar/index.vue"))
        }]
    }]
})

export default dashboardWidgetManage