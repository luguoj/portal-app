import {ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT} from "@/modules/sample-page/route";

export const menus = [{
    id: 'sample-page',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        route: ROUTE_SAMPLE
    }, {
        route: ROUTE_SAMPLE_PARENT
    }, {
        route: ROUTE_SAMPLE_2
    }]
}]