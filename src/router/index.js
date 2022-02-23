import {createRouter, createWebHashHistory} from "vue-router"

export const router = createRouter({
    history: createWebHashHistory(),
    routes: []
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})
