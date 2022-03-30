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


export class AppContext {
    private readonly _moduleConfigs: ModuleConfig[]
    private readonly _injectKey: string
    readonly store: Store<StoreRootState>
    readonly router: Router
    readonly navigationMenu: NavigationMenu
    readonly plugins: Record<string, AppPlugin> = {}

    constructor(
        moduleConfigs: ModuleConfig[],
        injectKey: string,
        storePlugins?: StorePlugin<any>[],
    ) {
        this._moduleConfigs = moduleConfigs
        this._injectKey = injectKey
        this.store = buildStore(moduleConfigs, storePlugins)
        this.router = buildRouter(moduleConfigs)
        this.navigationMenu = buildNavigationMenu(moduleConfigs)
    }

    use(plugin: AppPlugin) {
        this.plugins[plugin.name] = plugin
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