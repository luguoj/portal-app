import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";

export const ROUTE_SAMPLE: PsrAppRouteRecordRaw = {
    name: 'sample',
    path: 'sample',
    component: () => import('@/modules/sample-page/views/SamplePage.vue'),
    meta: {
        tag: {
            title: '样例页面',
            iconCls: 'pi pi-book'
        },
        permission: []
    }
}

export const ROUTE_SAMPLE_2: PsrAppRouteRecordRaw = {
    name: 'sample-2',
    path: 'sample-2',
    component: () => import('@/modules/sample-page/views/SamplePage.vue'),
    meta: {
        tag: {
            title: '样例页面-2',
            iconCls: 'pi pi-book'
        }
    },
}

export const ROUTE_SAMPLE_PARENT: PsrAppRouteRecordRaw = {
    name: 'sample-parent',
    path: 'sample-parent',
    component: () => import('@/modules/sample-page/views/SampleParentPage.vue'),
    meta: {
        tag: {
            title: '样例父页面',
            iconCls: 'pi pi-book',
        }
    },
    children: [{
        name: 'sample-parent/sample-child',
        path: ':pageNo',
        meta: {
            tag: {
                title: '样例子页面1'
            }
        },
        component: () => import('@/modules/sample-page/views/SampleChildPage.vue'),
        props: true,
        children: [{
            name: 'sample-parent/sample-child/sample-child2',
            path: ':pageNo2',
            meta: {
                tag: {
                    title: '样例子页面2'
                }
            },
            component: () => import('@/modules/sample-page/views/SampleChildPage.vue'),
            props: (route) => ({pageNo: route.params.pageNo2})
        }]
    }]
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT]