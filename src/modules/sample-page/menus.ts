import {ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT} from "@/modules/sample-page/route";

export const menus = [{
    route: ROUTE_SAMPLE
}, {
    id: 'sample-page',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        route: ROUTE_SAMPLE_PARENT
    }, {
        id: 'sample-page-level-2',
        title: '二级菜单',
        iconCls: 'pi pi-book',
        children: [{
            route: ROUTE_SAMPLE_2
        }]
    }]
}]