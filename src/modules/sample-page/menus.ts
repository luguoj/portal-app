import {ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT} from "@/modules/sample-page/route";

export const menus = [{
    id: 'sample-page',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        id: 'sample',
        title: '样例',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE
    }, {
        id: 'sample-parent',
        title: '嵌套页面',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_PARENT
    }, {
        id: 'sample-2',
        title: '样例-2',
        iconCls: 'pi pi-book',
        route: ROUTE_SAMPLE_2
    }]
}]