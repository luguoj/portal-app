import {AppNavigationMenuItemRaw} from "../plugins/navigation-menu";
import {ModuleTree} from "vuex";
import {RouteRecordRaw} from "vue-router";
import {AppLayoutConfig} from "./AppLayoutConfig";
import {AppLayoutMeta} from "./AppLayoutMeta"
import {PSRRouteRecordRaw} from "@/libs/commons/router/psr-router-interface";

export function extractAppLayoutConfigs(layouts: AppLayoutConfig[]) {
    // 布局菜单映射
    const menus: Record<string, AppNavigationMenuItemRaw[]> = {}
    // vuex模块
    const stores: ModuleTree<any> = {}
    // 根路由
    const rootRoute: RouteRecordRaw = {
        name: 'root',
        path: '/',
        redirect: ''
    }
    const routes: RouteRecordRaw[] = [rootRoute]
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        menus[layout.name] = []
        // 布局状态
        if (layout.store) {
            stores[layout.name] = layout.store
        }
        // 创建布局路由
        const layoutRoute: RouteRecordRaw & AppLayoutMeta = {
            component: layout.component,
            path: layout.path || "/" + layout.name,
            name: layout.name,
            meta: {
                tag: {
                    title: layout.title,
                    iconCls: layout.iconCls
                },
                permission: layout.permission ? {key: layout.name} : false,
            },
            children: []
        }
        routes.push(layoutRoute)
        // 创建布局子路由
        if (layout.routes) {
            layoutRoute.children!.push(...buildLayoutChildRoutes(layout.routes, layout.name))
        }
        // 创建布局子菜单
        if (layout.menus) {
            menus[layout.name].push(...layout.menus)
        }
        // 如果跟路由没有跳转，或默认布局，则设置根路由跳转到此路由
        if (layout.default || rootRoute.redirect === '') {
            rootRoute.redirect = layoutRoute.path
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.menus) {
                    menus[layout.name].push(...module.menus)
                }
                if (module.store) {
                    stores[module.name] = module.store
                }
                if (module.routes) {
                    layoutRoute.children!.push(...buildLayoutChildRoutes(module.routes, layout.name))
                }
            }
        }
    }
    return {menus, stores, routes}
}

// 构建布局子路由，路由名称增加布局名前缀
function buildLayoutChildRoutes(moduleRouteRaws: PSRRouteRecordRaw[], layoutName: string): PSRRouteRecordRaw[] {
    const moduleRoutes: PSRRouteRecordRaw[] = []
    for (const moduleRouteRaw of moduleRouteRaws) {
        const moduleRoute = {
            ...moduleRouteRaw,
            name: `${layoutName}/${moduleRouteRaw.name}`
        }
        moduleRoutes.push(moduleRoute)
        if (moduleRoute.children) {
            moduleRoute.children = buildLayoutChildRoutes(moduleRoute.children, layoutName)
        }
    }
    return moduleRoutes
}