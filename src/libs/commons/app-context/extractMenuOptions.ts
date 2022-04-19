// 布局菜单映射
import {PsrAppLayoutOptions} from "./types/PsrAppLayoutOptions";
import {buildMenuItem, PsrAppNavigationLayoutItem, PsrAppNavigationMenuItem} from "./navigation-menu";

export function extractMenuOptions(layouts: PsrAppLayoutOptions[]) {
    const layoutItemsRaw: PsrAppNavigationLayoutItem[] = []
    const menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        const layoutItemRaw: PsrAppNavigationLayoutItem = {
            name: layout.name,
            path: "/" + layout.name,
            title: layout.title,
            iconCls: layout.iconCls,
            permission: layout.permission === true
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