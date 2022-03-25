import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import {Modules} from "@/modules";

declare const NProgress: any

const routes: RouteRecordRaw[] = []
for (const module of Modules) {
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

export default router
