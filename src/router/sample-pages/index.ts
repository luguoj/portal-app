import {PSRRouteRecordRaw} from "@/router/RouteRecordRaw";

export const ROUTE_SAMPLE: PSRRouteRecordRaw = {
    name: 'sample',
    path: '/sample',
    component: () => import('@/views/sample-pages/SamplePage.vue'),
    meta: {
        tag: {
            title: '样例页面',
            iconCls: 'pi pi-book'
        }
    }
}

export const ROUTE_SAMPLE_2: PSRRouteRecordRaw = {
    name: 'sample-2',
    path: '/sample-2',
    component: () => import('@/views/sample-pages/SamplePage.vue'),
    meta: {
        tag: {
            title: '样例页面-2',
            iconCls: 'pi pi-book'
        }
    },
}

export const ROUTE_SAMPLE_PARENT: PSRRouteRecordRaw = {
    name: 'sample-parent',
    path: '/sample-parent',
    component: () => import('@/views/sample-pages/SampleParentPage.vue'),
    meta: {
        tag: {
            title: '样例父页面',
            iconCls: 'pi pi-book',
        }
    },
    children: [{
        name: 'sample-parent/sample-child',
        path: ':pageNo',
        component: () => import('@/views/sample-pages/SampleChildPage.vue'),
        props: true,
        children: [{
            name: 'sample-parent/sample-child/sample-child2',
            path: ':pageNo2',
            component: () => import('@/views/sample-pages/SampleChildPage.vue'),
            props: (route: any) => ({pageNo: route.params.pageNo2})
        }]
    }]
}

export const ROUTES_SAMPLE_PAGES: Array<PSRRouteRecordRaw> = [ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT]