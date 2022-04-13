import {PsrAppPlugin} from "./types/PsrAppPlugin";
import {App, watch} from "vue";
import {ModuleTree, Store} from "vuex";
import {Router} from "vue-router";
import {buildMenuItem, PsrAppNavigationLayoutItem, PsrAppNavigationMenu, PsrAppNavigationMenuItem} from "./navigation-menu";
import {PermitAll, PsrAppPermission} from "./permission";
import {buildLayoutChildRoute, PsrAppRouteMetaPermission, PsrAppRouter, PsrAppRouteRecord} from "./route";
import {PsrAppContextOptions} from "./types/PsrAppContextOptions";
import {ElMessage} from "element-plus/es";
import {PsrAppLayoutOptions} from "./types/PsrAppLayoutOptions";
import {PsrAppPageOptions} from "./types/PsrAppPageOptions";
import {PsrAppStoreRootState} from "./store/types/PsrAppStoreRootState";
import {PsrAppStore} from "./store/PsrAppStore";
import PsrInitializing from "@/libs/components/psr/views/PsrInitializing.vue";

export class PsrAppContext {
    private readonly _injectKey: string
    readonly store: PsrAppStore
    readonly router: PsrAppRouter
    readonly navigationMenu: PsrAppNavigationMenu
    readonly permission: PsrAppPermission
    readonly plugins: Record<string, PsrAppPlugin> = {}

    constructor(
        injectKey: string,
        options: PsrAppContextOptions
    ) {
        this._injectKey = injectKey
        // 初始化store
        this.store = new PsrAppStore(extractStoreOptions(options.layouts), options.storePlugins)
        // 初始化router
        this.router = new PsrAppRouter(extractRouterOptions(options.layouts, options.pages))
        // 初始化navigation-menu
        this.navigationMenu = new PsrAppNavigationMenu(extractMenuOptions(options.layouts))
        // 初始化permission
        this.permission = new PsrAppPermission(options.permission)
    }

    use(plugin: PsrAppPlugin) {
        this.plugins[plugin.injectKey] = plugin
        return this
    }

    install(app: App) {
        app.provide(this._injectKey, this)
        app.use(this.store.store)
        app.use(this.router.router)
        for (const pluginsKey in this.plugins) {
            app.use(this.plugins[pluginsKey], this)
        }
        // 用户切换时更新许可
        updatePermissionOnUsernameChange(this.permission, this.store.store)
        // 根据许可阻断路由
        blockRouteByPermission(this.permission, this.router.router)
        // 根据许可过滤导航菜单
        filterNavigationMenuByPermission(this.navigationMenu, this.permission)
        // 布局切换触发模块更新
        this.router.onLayoutChange(current => {
            console.log('布局切换触发模块更新')
            this.navigationMenu.currentLayoutName.value = current.layout?.name || ''
            for (const pluginsKey in this.plugins) {
                this.plugins[pluginsKey].onLayoutChange()
            }
        })
    }

}

function filterNavigationMenuByPermission(
    navigationMenu: PsrAppNavigationMenu,
    permission: PsrAppPermission
) {
    watch(() => permission.permission.value, permissionValue => {
        permissionValue.then(permissionByRouteName => {
            console.log('许可更新->过滤导航菜单')
            if (permissionByRouteName === PermitAll) {
                navigationMenu.doFilter(() => true, () => true)
            } else {
                navigationMenu.doFilter(
                    item => !!permissionByRouteName[item.name],
                    item => !!item.route?.meta?.permission && !!permissionByRouteName[item.route.meta.permission.key]
                )
            }
        })
    }, {immediate: true})
}

function updatePermissionOnUsernameChange(permission: PsrAppPermission, store: Store<PsrAppStoreRootState>) {
    // 用户切换时重新获取许可
    watch(() => store.state.username, username => {
        console.log('用户切换->更新许可')
        permission.changeUser(username)
    }, {immediate: true})
}

function blockRouteByPermission(permission: PsrAppPermission, router: Router) {
    // 通过许可控制路由跳转
    router.beforeEach(to => {
        if (to.meta.permission) {
            const {key} = to.meta.permission as PsrAppRouteMetaPermission
            return permission.permission.value.then(permissionByKey => {
                if (permissionByKey !== PermitAll
                    && !permissionByKey[key]) {
                    ElMessage({
                        showClose: true,
                        message: '无权访问此页面.',
                        type: 'error',
                    })
                    return false
                }
                return true
            })
        }
    })
}

// 布局菜单映射
export function extractMenuOptions(layouts: PsrAppLayoutOptions[]) {
    const layoutItemsRaw: PsrAppNavigationLayoutItem[] = []
    const menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        const layoutItemRaw: PsrAppNavigationLayoutItem = {
            name: layout.name,
            path: "/" + layout.name,
            title: layout.title,
            iconCls: layout.iconCls
        }
        layoutItemsRaw.push(layoutItemRaw)
        menuItemsRaw[layout.name] = []
        // 创建布局子菜单
        if (layout.menus) {
            for (const menu of layout.menus) {
                menuItemsRaw[layout.name].push(buildMenuItem(menu, layout.name))
            }
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.menus) {
                    for (const menu of module.menus) {
                        menuItemsRaw[layout.name].push(buildMenuItem(menu, layout.name))
                    }
                }
            }
        }
    }
    return {layoutItemsRaw, menuItemsRaw}
}

// vuex模块
export function extractStoreOptions(layouts: PsrAppLayoutOptions[]) {
    const stores: ModuleTree<any> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        // 布局状态
        if (layout.store) {
            stores[layout.name] = layout.store
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.store) {
                    stores[module.name] = module.store
                }
            }
        }
    }
    return stores
}

export function extractRouterOptions(
    layouts: PsrAppLayoutOptions[],
    {errorNotFound, signIn}: PsrAppPageOptions
) {
    // 根路由
    const rootRoute: PsrAppRouteRecord = {
        name: 'root',
        path: '/',
        component: PsrInitializing,
        meta: {
            nameRaw: 'root',
            tag: {
                title: 'root'
            }
        }
    }
    const errorNotFoundRoute: PsrAppRouteRecord = {
        name: 'error-not-found',
        path: '/:pathMatch(.*)*',
        props: true,
        meta: {
            nameRaw: 'error-not-found',
            tag: {
                title: '页面不存在',
                iconCls: 'pi pi-times'
            }
        },
        component: errorNotFound
    }
    const signInRoute: PsrAppRouteRecord = {
        name: 'sign-in',
        path: '/sign-in',
        meta: {
            nameRaw: 'sign-in',
            tag: {
                title: "登录",
                iconCls: 'pi pi-sign-in'
            }
        },
        component: signIn
    }
    const routes: PsrAppRouteRecord[] = [rootRoute, errorNotFoundRoute, signInRoute]
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        // 创建布局路由
        const layoutRoute: PsrAppRouteRecord = {
            component: layout.component,
            path: "/" + layout.name,
            name: layout.name,
            meta: {
                nameRaw: layout.name,
                tag: {
                    title: layout.title,
                    iconCls: layout.iconCls
                },
                permission: layout.permission ? {key: layout.name} : undefined,
                layout: true
            },
            children: [{
                ...errorNotFoundRoute,
                name: `${layout.name}/${errorNotFoundRoute.name}`,
                path: `/${layout.name}${errorNotFoundRoute.path}`
            }]
        }
        routes.push(layoutRoute)
        // 创建布局子路由
        if (layout.routes) {
            for (let j = 0; j < layout.routes.length; j++) {
                const route = layout.routes[j];
                layoutRoute.children!.push(buildLayoutChildRoute(route, layout.name))
            }
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.routes) {
                    for (let j = 0; j < module.routes.length; j++) {
                        const route = module.routes[j];
                        layoutRoute.children!.push(buildLayoutChildRoute(route, layout.name))
                    }
                }
            }
        }
    }
    return routes
}