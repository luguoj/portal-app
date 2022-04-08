import {AppPlugin} from "./AppPlugin";
import {App, ref, Ref, watchEffect} from "vue";
import {createStore, Plugin as StorePlugin, Store, StoreOptions} from "vuex";
import {RouteLocationNormalizedLoaded, Router} from "vue-router";
import {AppNavigationMenu} from "./navigation-menu";
import {AppPermission, PermissionPromise} from "./permission";
import {buildStore, buildStoreOptions, StoreRootState} from "./store";
import {buildRouter} from "./router";
import {filterNavigationMenuByPermission} from "./filterNavigationMenuByPermission";
import {AppLayoutConfig} from "psr-app-context/layout/AppLayoutConfig";
import {
    extractMenuConfig,
    extractRouterConfig,
    extractStoreConfig
} from "psr-app-context/extractAppLayoutConfigs";
import {AppLayoutRouteRecord} from "psr-app-context/layout/AppLayoutRouteRecord";
import {blockRouteByPermission} from "psr-app-context/blockRouteByPermission";
import {updatePermissionOnUsernameChange} from "psr-app-context/updatePermissionOnUsernameChange";
import {Component} from "@vue/runtime-core";
import {PSRRouteRecord} from "psr-app-context/route";

export interface AppPages {
    signIn: Component
    errorNotFound: Component
}

export interface AppContextOptions {
    layouts: AppLayoutConfig[]
    permission: (username: string) => PermissionPromise
    storePlugins?: StorePlugin<any>[],
    pages: AppPages
}

export interface AppRoute {
    layout: AppLayoutRouteRecord | null
    module: PSRRouteRecord | null
    route: RouteLocationNormalizedLoaded | null
}

export class AppContext {
    private readonly _injectKey: string
    private readonly _storeOptions: StoreOptions<StoreRootState>
    readonly store: Store<StoreRootState>
    readonly router: Router
    readonly currentRoute: Ref<AppRoute> = ref({layout: null, module: null, route: null})
    readonly navigationMenu: AppNavigationMenu
    readonly permission: AppPermission
    readonly plugins: Record<string, AppPlugin> = {}

    constructor(
        injectKey: string,
        options: AppContextOptions
    ) {
        this._injectKey = injectKey
        // 初始化store
        const storeConfig = extractStoreConfig(options.layouts)
        this._storeOptions = buildStoreOptions(storeConfig)
        this.store = buildStore(storeConfig, options.storePlugins)
        // 初始化router
        this.router = buildRouter(extractRouterConfig(options.layouts, options.pages))
        // 初始化navigation-menu
        this.navigationMenu = new AppNavigationMenu(extractMenuConfig(options.layouts))
        // 初始化permission
        this.permission = new AppPermission(options.permission)
    }

    use(plugin: AppPlugin) {
        this.plugins[plugin.injectKey] = plugin
        return this
    }

    install(app: App) {
        app.provide(this._injectKey, this)
        app.use(this.store)
        app.use(this.router)
        for (const pluginsKey in this.plugins) {
            app.use(this.plugins[pluginsKey], this)
        }
        // 用户切换时更新许可
        updatePermissionOnUsernameChange(this.permission, this.store)
        // 根据许可阻断路由
        blockRouteByPermission(this.permission, this.router)
        // 根据许可过滤导航菜单
        filterNavigationMenuByPermission(this.navigationMenu, this.permission)
        // 路由跳转切换布局信息
        watchEffect(() => {
            const route = this.router.currentRoute.value
            let layoutChange = false
            const newRoute: AppRoute = {
                layout: null,
                module: null,
                route
            }
            if (route.matched.length > 0 && route.name !== 'root') {
                newRoute.layout = route.matched[0] as unknown as AppLayoutRouteRecord
                if (route.matched[0].name !== this.currentRoute.value.layout?.name) {
                    console.log('切换应用布局')
                    layoutChange = true
                }
                if (route.matched.length > 1) {
                    newRoute.module = route.matched[1] as unknown as PSRRouteRecord
                    if (this.currentRoute.value.module?.name !== route.matched[1].name) {
                        console.log('切换应用模块')
                    }
                }
            }
            this.currentRoute.value = newRoute
            if (layoutChange) {
                this.navigationMenu.updateLayout(newRoute.layout!)
                for (const pluginsKey in this.plugins) {
                    this.plugins[pluginsKey].onLayoutChange()
                }
            }
        })
    }

    resetStore() {
        this.store.replaceState(createStore(this._storeOptions).state)
    }
}