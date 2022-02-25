import {createRouter, createWebHashHistory} from "vue-router"
import samplePage from "@/router/sample-page";
import common from "@/router/common";

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...common,
        ...samplePage,

    ]
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})
