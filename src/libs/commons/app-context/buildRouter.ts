import {ModuleConfig} from "./ModuleConfig";
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

declare const NProgress: any

export function buildRouter(moduleConfigs: ModuleConfig[]) {
    const routes: RouteRecordRaw[] = []
    for (const module of moduleConfigs) {
        if (module.routes) {
            routes.push(...module.routes)
        }
    }
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