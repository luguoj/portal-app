export const ROUTE_SAMPLE = {
    name: 'sample',
    path: '/sample',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta: {
        title: '样例页面',
        iconCls: 'pi pi-book'
    }
}

export const ROUTE_SAMPLE_2 = {
    name: 'sample-2',
    path: '/sample-2',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta: {
        title: '样例页面-2',
        iconCls: 'pi pi-book'
    },
}

export const ROUTE_SAMPLE_PARENT = {
    name: 'sample-parent',
    path: '/sample-parent',
    component: () => import('@/views/sample-pages/SampleParentPage'),
    meta: {
        title: '样例父页面',
        iconCls: 'pi pi-book',
    },
    children: [{
        name: 'sample-parent/sample-child',
        path: ':pageNo',
        component: () => import('@/views/sample-pages/SampleChildPage'),
        props: true,
        children: [{
            name: 'sample-parent/sample-child/sample-child2',
            path: ':pageNo2',
            component: () => import('@/views/sample-pages/SampleChildPage'),
            props: route => ({pageNo: route.params.pageNo2})
        }]
    }]
}

export const ROUTES_SAMPLE_PAGES = [ROUTE_SAMPLE, ROUTE_SAMPLE_2, ROUTE_SAMPLE_PARENT]