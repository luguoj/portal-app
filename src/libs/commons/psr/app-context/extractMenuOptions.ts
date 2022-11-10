// 布局菜单映射
import {PsrAppLayoutOptions} from "./types/PsrAppLayoutOptions";
import {buildMenuItem, PsrAppNavigationLayoutItem, PsrAppNavigationMenuItems} from "./navigation-menu";

export function extractMenuOptions(layouts: PsrAppLayoutOptions[]): {
    layoutItemsRaw: PsrAppNavigationLayoutItem[],
    menuItemsRaw: Record<string, PsrAppNavigationMenuItems>
} {
    const layoutItemsRaw: PsrAppNavigationLayoutItem[] = []
    const menuItemsRaw: Record<string, PsrAppNavigationMenuItems> = {}
    for (let i = 0; i < layouts.length; i++) {
        const layout = layouts[i];
        const layoutItemRaw: PsrAppNavigationLayoutItem = {
            name: layout.name,
            path: "/" + layout.name,
            title: layout.title,
            iconCls: layout.iconCls,
            permissions: layout.permissions
        }
        layoutItemsRaw.push(layoutItemRaw)
        menuItemsRaw[layout.name] = {}
        // 创建布局子菜单
        if (layout.menus) {
            const menus = layout.menus;
            for (const menuUsage in menus) {
                menuItemsRaw[layout.name][menuUsage] = []
                for (const menu of layout.menus[menuUsage]) {
                    menuItemsRaw[layout.name][menuUsage].push(buildMenuItem(menu, layout.name))
                }
            }
        }
        // 处理模块配置
        if (layout.modules) {
            for (const module of layout.modules) {
                if (module.menus) {
                    for (const menuUsage in module.menus) {
                        menuItemsRaw[layout.name][menuUsage] = menuItemsRaw[layout.name][menuUsage] || []
                        for (const menu of module.menus[menuUsage]) {
                            menuItemsRaw[layout.name][menuUsage].push(buildMenuItem(menu, layout.name))
                        }
                    }
                }
            }
        }
    }
    return {layoutItemsRaw, menuItemsRaw}
}