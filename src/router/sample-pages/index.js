export const SAMPLE = {
    name: 'sample',
    path: '/sample',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta: {
        title: '样例页面',
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
        path: ':pageNo',
        component: () => import('@/views/sample-pages/SampleChildPage'),
        props: true
    }]
}

export const SAMPLE_PAGES = [SAMPLE, SAMPLE_PARENT]