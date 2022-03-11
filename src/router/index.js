import {createRouter, createWebHashHistory} from "vue-router"
import {routesDesktop} from "@/router/desktop";
import {initMenuRoutes} from "@/router/initMenuRoutes";
import {MenuRoutes} from "@/router/MenuRoutes";


export const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routesDesktop()]
})

router.beforeEach(() => {
    NProgress.start()
})

router.afterEach(() => {
    NProgress.done()
})

export const menuItems = initMenuRoutes(MenuRoutes(), router)