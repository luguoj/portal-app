import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

declare const NProgress: any

export function buildRouter(routes: RouteRecordRaw[]) {
    const router = createRouter({
        history: createWebHashHistory(),
        routes
    })
    router.beforeEach(() => {
        NProgress.start()
    })
    router.afterEach(() => {
        NProgress.done()
    })
    return router
}