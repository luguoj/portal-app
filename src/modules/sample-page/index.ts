import {PsrAppModuleOptions} from "@/libs/commons/psr/app-context/";
import {routes} from "./route";
import {menus} from "./menus";
import {PsrAppWidgetCatalogRaw} from "@/libs/commons/psr/app-context/widget-manager";
import {defineAsyncComponent, markRaw} from "vue";

export const SamplePage: PsrAppModuleOptions = {
    name: "sample-page",
    routes,
    menus
}

export const SamplePageWidgets: PsrAppWidgetCatalogRaw[] = [{
    name: 'sample/charts',
    title: '样例/图表',
    widgets: [{
        name: 'line',
        title: '折线图',
        component: markRaw(defineAsyncComponent(() => import("@/modules/sample-page/widgets/charts/line/index.vue"))),
        permissions: []
    }, {
        name: 'radar',
        title: '雷达图',
        component: markRaw(defineAsyncComponent(() => import("@/modules/sample-page/widgets/charts/radar/index.vue"))),
        permissions: []
    }]
}]