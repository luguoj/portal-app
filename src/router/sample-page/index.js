import {defineAsyncComponent} from "vue";
import axios from "axios";

export default [{
    path: '/sample-page-1',
    component: defineAsyncComponent(
        () =>
            axios.get('./sample-page.js').then((resp) => {
                return eval(resp.data)
            })
    ),
    meta:{
      title:'样例页面1',
      iconCls:'pi pi-book'
    },
    // 查询字符串传参
    props: route => ({
        ...route.query
    })
}, {
    path: '/sample-page-2/:pageNo',
    component: () => import('@/views/sample-pages/SamplePage'),
    meta:{
        title:'样例页面2',
        iconCls:'pi pi-book'
    },
    // 地址参数传参
    props: true
}]