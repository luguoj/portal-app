import {ModuleConfig} from "./ModuleConfig";
import {AppPlugin} from "./AppPlugin";
import {App} from "vue";
import {Plugin as StorePlugin, Store} from "vuex";
import {Router} from "vue-router";
import {StoreRootState} from "@/libs/commons/app-context/StoreRootState";
import {NavigationMenu} from "@/libs/commons/navigation-menu";
import {buildStore} from "./buildStore";
import {buildRouter} from "./buildRouter";
import {buildNavigationMenu} from "./buildNavigationMenu";

export interface AppContextOptions {
    modules: ModuleConfig[]
    permission: (username: string) => PermissionPromise
    storePlugins?: StorePlugin<any>[]
}

export class AppContext {
    private readonly _injectKey: string
    private _moduleConfigs: ModuleConfig[]
    readonly store: Store<StoreRootState>
    readonly router: Router
    readonly navigationMenu: NavigationMenu
    readonly plugins: Record<string, AppPlugin> = {}

    constructor(
        injectKey: string,
        options: AppContextOptions
    ) {
        this._injectKey = injectKey
        this._moduleConfigs = options.modules
        this.store = buildStore(options.modules, options.storePlugins)
        this.router = buildRouter(options.modules)
        this.navigationMenu = buildNavigationMenu(options.modules)
    }

    use(plugin: AppPlugin) {
        this.plugins[plugin.injectKey] = plugin
        return this
    }

    install(app: App) {
        app.provide(this._injectKey, this)
        app.use(this.store)
        app.use(this.router)
        app.use(this.navigationMenu, this)
        for (const pluginsKey in this.plugins) {
            app.use(this.plugins[pluginsKey], this)
        }
    }

    resetStore() {
        this.store.replaceState(buildStore(this._moduleConfigs).state)
    }
}