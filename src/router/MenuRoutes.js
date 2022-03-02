import {HOME} from "@/router/desktop";
import {SAMPLE, SAMPLE_PARENT} from "@/router/sample-pages";

export const MenuRoutes = [{
    id: 'desktop',
    route: HOME
}, {
    id: 'sample-pages',
    title: '样例页面',
    iconCls: 'pi pi-book',
    children: [{
        id: 'sample',
        title: '样例',
        iconCls: 'pi pi-book',
        route: SAMPLE
    }, {
        id: 'sample-parent',
        title: '嵌套页面',
        iconCls: 'pi pi-book',
        route: SAMPLE_PARENT
    }]
}]