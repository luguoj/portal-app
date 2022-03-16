import {createRouter, createWebHashHistory} from "vue-router"
import {ROUTES_DESKTOP} from "@/router/desktop";
import {ROUTES_SAMPLE_PAGES} from "@/router/sample-pages";
import {ROUTES_ADMIN} from "@/router/admin";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...ROUTES_DESKTOP,
        ...ROUTES_SAMPLE_PAGES,
        ...ROUTES_ADMIN
    ]
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})
