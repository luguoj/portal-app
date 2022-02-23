import {createRouter, createWebHistory} from "vue-router"

export const router = createRouter({
    history: createWebHistory(),
    routes: []
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})
