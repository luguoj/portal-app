export const SAMPLE = {
    name: 'sample',
    path: '/sample',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta: {
        title: '样例页面',
        iconCls: 'pi pi-book'
    },
}
export const SAMPLE_2 = {
    name: 'sample-2',
    path: '/sample-2',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta: {
        title: '样例页面-2',
        iconCls: 'pi pi-book'
    },
}
export const SAMPLE_PARENT = {
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
            path: ':pageNo2',
            component: () => import('@/views/sample-pages/SampleChildPage'),
            props: route => ({pageNo: route.params.pageNo2})
        }]
    }]
}

export const SAMPLE_PAGES = [SAMPLE, SAMPLE_PARENT]