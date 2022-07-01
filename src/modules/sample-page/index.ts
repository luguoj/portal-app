import {PsrAppModuleOptions} from "@/libs/commons/psr/app-context/";
import {routes} from "./route";
import {menus} from "./menus";
import {PsrAppWidgetCatalogRaw} from "@/libs/commons/psr/app-context/widget-manager";
import {defineAsyncComponent, markRaw} from "vue";
import './asserts/style/widgets.scss'

export const SamplePage: PsrAppModuleOptions = {
    name: "sample-page",
    routes,
    menus
}

export const SamplePageWidgets: PsrAppWidgetCatalogRaw[] = [{
    name: 'sample/charts',
    title: '样例/图表',
    iconCls: 'psr-sample-page-widget-chart',
    widgets: [{
        name: 'line',
        title: '折线图',
        component: markRaw(defineAsyncComponent(() => import("@/modules/sample-page/widgets/charts/line/index.vue"))),
        thumbnailCls: 'psr-sample-page-widget-chart-line',
        permissions: []
    }, {
        name: 'radar',
        title: '雷达图',
        component: markRaw(defineAsyncComponent(() => import("@/modules/sample-page/widgets/charts/radar/index.vue"))),
        thumbnailCls: 'psr-sample-page-widget-chart-radar',
        permissions: []
    }]
}]