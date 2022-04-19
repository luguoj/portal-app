import {PsrAppLayoutOptions} from "./types/PsrAppLayoutOptions";
import {PsrAppPageOptions} from "./types/PsrAppPageOptions";
import {buildLayoutChildRoute, PsrAppRouteRecord} from "./route";
import PsrInitializing from "@/libs/components/psr/views/PsrInitializing.vue";

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