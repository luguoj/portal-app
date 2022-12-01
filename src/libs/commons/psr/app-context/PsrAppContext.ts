import {PsrAppPlugin} from "./types/PsrAppPlugin";
import {App, watch} from "vue";
import {PsrAppNavigationMenu} from "./navigation-menu";
import {PsrAppPermission} from "./permission";
import {PsrAppRouter} from "./route";
import {PsrAppContextOptions} from "./types/PsrAppContextOptions";
import {PsrAppStore} from "./store/PsrAppStore";
import {PsrPlatformClient} from "@psr-framework/vue3-plugin-platform-client";
import {extractStoreOptions} from "./extractStoreOptions";
import {extractRouterOptions} from "./extractRouterOptions";
import {extractMenuOptions} from "./extractMenuOptions";
import {handleAuthorizationPrincipalChange} from "@/libs/commons/psr/app-context/handleAuthorizationPrincipalChange";
import {checkRoutePermission} from "./checkRoutePermission";
import {processRootRoute} from "./processRootRoute";
import {processSignInRoute} from "./processSignInRoute";
import {PsrAppWidgetManager} from "@/libs/commons/psr/app-context/widget-manager";
import {PsrAppPersonal} from "@/libs/commons/psr/app-context/personal";

export class PsrAppContext {
    readonly store: PsrAppStore
    readonly router: PsrAppRouter
    readonly navigationMenu: PsrAppNavigationMenu
    readonly permission: PsrAppPermission
    readonly widget: PsrAppWidgetManager
    platformClient?: PsrPlatformClient
    readonly plugins: Record<string, PsrAppPlugin> = {}
    readonly personal: PsrAppPersonal
    // 被登录路由挂起的路由路径
    routePathHangupBySignIn: string = '/'
    private readonly _injectKey: string

    constructor(
        injectKey: string,
        options: PsrAppContextOptions
    ) {
        this._injectKey = injectKey
        // 初始化store
        this.store = new PsrAppStore(extractStoreOptions(options.layouts), options.userProfileService, options.storePlugins)
        // 初始化router
        this.router = new PsrAppRouter(extractRouterOptions(options.layouts, options.pages))
        // 初始化navigation-menu
        this.navigationMenu = new PsrAppNavigationMenu(extractMenuOptions(options.layouts))
        // 初始化permission
        this.permission = new PsrAppPermission(options.permissionService)
        // 初始化widgetManager
        this.widget = new PsrAppWidgetManager(options.widgets)
        // 初始化personal
        this.personal = new PsrAppPersonal(options.personalService)
    }

    usePlatformClient(platformClient: PsrPlatformClient) {
        this.platformClient = platformClient
        return this
    }

    use(plugin: PsrAppPlugin) {
        this.plugins[plugin.injectKey] = plugin
        return this
    }

    install(app: App) {
        if (this.platformClient) {
            watch(this.platformClient.authorizationContext.principal, (newValue, oldValue) => {
                handleAuthorizationPrincipalChange(this, newValue, oldValue)
            }, {immediate: true})
        }
        this.router.beforeLayoutChange(event => {
            // 处理登录路由，路由名为sign-in
            // 1. 如果token认证状态为AUTHENTICATED，进行拦截
            // 2. 如果token认证状态不为AUTHENTICATED，挂起前一页面
            processSignInRoute(event, this)
            // 如果访问根路由，则跳转到默认布局
            processRootRoute(event, this)
        })
        this.router.beforeRouteChange(event => {
            if (event.newRoute.route.name !== 'sign-in') {
                this.routePathHangupBySignIn = event.newRoute.route.fullPath
            }
            // 校验布局和路由许可
            checkRoutePermission(event, this)
        })
        this.router.onLayoutChange(event => {
            this.navigationMenu.currentLayoutName.value = event.newRoute.layout?.name || ''
        })
        app.provide(this._injectKey, this)
        app.use(this.store.store)
        app.use(this.router.router)
        if (this.platformClient != undefined) {
            app.use(this.platformClient)
        }
        for (const pluginsKey in this.plugins) {
            app.use(this.plugins[pluginsKey], this)
        }
    }
}