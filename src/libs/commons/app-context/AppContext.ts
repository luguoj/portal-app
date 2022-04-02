import {AppPlugin} from "./AppPlugin";
import {App, ref, Ref, watchEffect} from "vue";
import {createStore, ModuleTree, Plugin as StorePlugin, Store, StoreOptions} from "vuex";
import {Router, RouteRecordRaw} from "vue-router";
import {
    createAppNavigationMenu,
    AppNavigationMenu,
    AppNavigationMenuItemRaw, AppNavigationMenuItem
} from "./plugins/navigation-menu";
import {
    AppPermission,
    PermissionPromise,
    createAppPermission
} from "./plugins/permission";
import {buildStore, buildStoreOptions, StoreRootState} from "./store";
import {buildRouter} from "./router";
import {filterNavigationMenuByPermission} from "./filterNavigationMenuByPermission";
import {AppLayoutConfig} from "psr-app-context/layout/AppLayoutConfig";
import {extractAppLayoutConfigs} from "psr-app-context/layout/extractAppLayoutConfigs";
import {AppLayoutMeta} from "psr-app-context/layout/AppLayoutMeta";

export interface AppContextOptions {
    layouts: AppLayoutConfig[]
    permission: (username: string) => PermissionPromise
    storePlugins?: StorePlugin<any>[]
}

export class AppContext {
    private readonly _injectKey: string
    private readonly _configs: {
        menus: Record<string, AppNavigationMenuItemRaw[]>
        stores: ModuleTree<any>
        routes: RouteRecordRaw[]
    }
    private readonly _storeOptions: StoreOptions<StoreRootState>
    readonly store: Store<StoreRootState>
    readonly router: Router
    private readonly _navigationMenuRaw: Record<string, AppNavigationMenuItemRaw[]>
    readonly navigationMenu: AppNavigationMenu
    readonly permission: AppPermission
    readonly plugins: Record<string, AppPlugin> = {}
    readonly currentLayout: {
        meta: Ref<AppLayoutMeta | null>,
        navigationMenuItems: Ref<AppNavigationMenuItem[] | null>
    } = {
        meta: ref(null),
        navigationMenuItems: ref(null)
    };

    constructor(
        injectKey: string,
        options: AppContextOptions
    ) {
        this._injectKey = injectKey
        this._configs = extractAppLayoutConfigs(options.layouts)
        // 初始化store
        this._storeOptions = buildStoreOptions(this._configs.stores)
        this.store = buildStore(this._configs.stores, options.storePlugins)
        // 初始化router
        this.router = buildRouter(this._configs.routes)
        // 初始化navigation-menu
        this._navigationMenuRaw = this._configs.menus
        this.navigationMenu = createAppNavigationMenu()
        // 初始化permission
        this.permission = createAppPermission({service: options.permission})
        filterNavigationMenuByPermission(this._navigationMenuRaw, this.navigationMenu, this.permission)
        // 路由跳转切换布局信息
        watchEffect(()=>{
            const route = this.router.currentRoute.value
            if (route.matched.length > 0 && route.name !== 'root' && route.matched[0].name !== this.currentLayout.meta.value?.name) {
                const layoutMeta = route.matched[0] as unknown as AppLayoutMeta
                console.log('切换应用上下文布局信息')
                this.currentLayout.meta.value = layoutMeta
                this.currentLayout.navigationMenuItems.value = this.navigationMenu.menuItems.value[layoutMeta.name]
            }
        })
    }

    use(plugin: AppPlugin) {
        this.plugins[plugin.injectKey] = plugin
        return this
    }

    install(app: App) {
        app.provide(this._injectKey, this)
        app.use(this.store)
        app.use(this.router)
        app.use(this.permission, this)
        app.use(this.navigationMenu, this)
        for (const pluginsKey in this.plugins) {
            app.use(this.plugins[pluginsKey], this)
        }
    }

    resetStore() {
        this.store.replaceState(createStore(this._storeOptions).state)
    }
}