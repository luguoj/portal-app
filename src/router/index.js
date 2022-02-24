import {createRouter, createWebHashHistory} from "vue-router"
import ErrorNotFound from "@/views/error/ErrorNotFound";
import Blank from "@/views/blank/Blank";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: 'blank',
            path: '/',
            component: Blank
        },
        {
            name: 'error-not-found',
            path: '/:pathMatch(.*)*',
            component: ErrorNotFound
        }
    ]
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})
