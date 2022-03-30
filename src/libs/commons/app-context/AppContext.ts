import {extractModuleConfigs, ModuleConfig} from "./ModuleConfig";
import {AppPlugin} from "./AppPlugin";
import {App} from "vue";
import {createStore, ModuleTree, Plugin as StorePlugin, Store, StoreOptions} from "vuex";
import {Router, RouteRecordRaw} from "vue-router";
import {
    createAppNavigationMenu,
    AppNavigationMenu,
    AppNavigationMenuItemRaw
} from "./plugins/navigation-menu";
import {
    AppPermission,
    PermissionPromise,
    createAppPermission
} from "./plugins/permission";
import {buildStore, buildStoreOptions, StoreRootState} from "./store";
import {buildRouter} from "./router";
import {filterNavigationMenuByPermission} from "./filterNavigationMenuByPermission";

export interface AppContextOptions {
    modules: ModuleConfig[]
    permission: (username: string) => PermissionPromise
    storePlugins?: StorePlugin<any>[]
}

export class AppContext {
    private readonly _injectKey: string
    private readonly _moduleConfigs: {
        menus: AppNavigationMenuItemRaw[]
        stores: ModuleTree<any>
        routes: RouteRecordRaw[]
    }
    private readonly _storeOptions: StoreOptions<StoreRootState>
    readonly store: Store<StoreRootState>
    readonly router: Router
    private readonly _navigationMenuRaw: AppNavigationMenuItemRaw[]
    readonly navigationMenu: AppNavigationMenu
    readonly permission: AppPermission
    readonly plugins: Record<string, AppPlugin> = {}

    constructor(
        injectKey: string,
        options: AppContextOptions
    ) {
        this._injectKey = injectKey
        this._moduleConfigs = extractModuleConfigs(options.modules)
        // 初始化store
        this._storeOptions = buildStoreOptions(this._moduleConfigs.stores)
        this.store = buildStore(this._moduleConfigs.stores, options.storePlugins)
        // 初始化router
        this.router = buildRouter(this._moduleConfigs.routes)
        // 初始化navigation-menu
        this._navigationMenuRaw = this._moduleConfigs.menus
        this.navigationMenu = createAppNavigationMenu()
        // 初始化permission
        this.permission = createAppPermission({service: options.permission})
        filterNavigationMenuByPermission(this._navigationMenuRaw, this.navigationMenu, this.permission)
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