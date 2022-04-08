import {AppNavigationMenuItem} from "./navigation-menu";
import {ModuleTree} from "vuex";
import {AppLayoutConfig} from "./layout/AppLayoutConfig";
import {AppLayoutRouteRecord} from "./layout/AppLayoutRouteRecord"
import {PSRRouteRecord, buildLayoutChildRoute} from "./route";
import {buildAppNavigationMenuItem} from "psr-app-context/navigation-menu/buildAppNavigationMenuItem";
import {AppPages} from "psr-app-context/AppContext";

// 布局菜单映射
export function extractMenuConfig(layouts: AppLayoutConfig[]) {
    const menus: Record<string, AppNavigationMenuItem[]> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        menus[layout.name] = []
        // 创建布局子菜单
        if (layout.menus) {
            for (const menu of layout.menus) {
                menus[layout.name].push(buildAppNavigationMenuItem(menu, layout.name))
            }
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.menus) {
                    for (const menu of module.menus) {
                        menus[layout.name].push(buildAppNavigationMenuItem(menu, layout.name))
                    }
                }
            }
        }
    }
    return menus
}

// vuex模块
export function extractStoreConfig(layouts: AppLayoutConfig[]) {
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

export function extractRouterConfig(
    layouts: AppLayoutConfig[],
    {errorNotFound, signIn}: AppPages
) {
    // 根路由
    const rootRoute: PSRRouteRecord = {
        name: 'root',
        path: '/',
        redirect: '',
        meta: {
            tag: {
                title: 'root'
            }
        }
    }
    const errorNotFoundRoute: PSRRouteRecord = {
        name: 'error-not-found',
        path: '/:pathMatch(.*)*',
        props: true,
        meta: {
            tag: {
                title: '页面不存在',
                iconCls: 'pi pi-times'
            }
        },
        component: errorNotFound
    }
    const signInRoute: PSRRouteRecord = {
        name: 'sign-in',
        path: '/sign-in',
        meta: {
            tag: {
                title: "登录",
                iconCls: 'pi pi-sign-in'
            }
        },
        component: signIn
    }
    const routes: PSRRouteRecord[] = [rootRoute, errorNotFoundRoute, signInRoute]
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        // 创建布局路由
        const layoutRoute: PSRRouteRecord & AppLayoutRouteRecord = {
            component: layout.component,
            path: "/" + layout.name,
            name: layout.name,
            meta: {
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
        // 如果跟路由没有跳转，或默认布局，则设置根路由跳转到此路由
        if (layout.default || rootRoute.redirect === '') {
            rootRoute.redirect = layoutRoute.path
        }
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

