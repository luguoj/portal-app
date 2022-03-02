import {reactive} from "vue";

function initialize(menuItem, router) {
    if (menuItem.route) {
        const route = menuItem.route
        menuItem.title = menuItem.title || route.meta.title
        menuItem.iconCls = menuItem.iconCls || route.meta.iconCls
        route.meta = route.meta || {}
        route.meta.menuItem = menuItem
        router.addRoute(route)
    }
    if (menuItem.children) {
        for (let i = 0; i < menuItem.children.length; i++) {
            const childMenuItem = menuItem.children[i]
            initialize(childMenuItem, router);
            childMenuItem.parent = menuItem
        }
    }
}

export function initMenuRoutes(menuRoutes, router) {
    const menuItems = reactive([])
    initialize({children: menuRoutes}, router)
    menuItems.push(...menuRoutes)
    return menuItems
}