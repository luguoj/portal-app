function initialize(menuRoutes, router, parent) {
    if (menuRoutes && menuRoutes.length) {
        for (let i = 0; i < menuRoutes.length; i++) {
            const menuRoute = menuRoutes[i];
            menuRoute.allParents = []
            if (parent) {
                menuRoute.allParents.push(...parent.allParents)
                menuRoute.allParents.push(parent)
                menuRoute.parent = parent
            }
            if (menuRoute.route) {
                const route = menuRoute.route
                menuRoute.title = menuRoute.title || route.meta.title
                menuRoute.iconCls = menuRoute.iconCls || route.meta.iconCls
                route.meta = route.meta || {}
                route.meta.menuItem = menuRoute
                router.addRoute(route)
            }
            initialize(menuRoute.children, router, menuRoute)
        }
    }

}

export function initMenuRoutes(menuRoutes, router) {
    initialize(menuRoutes, router)
    return menuRoutes
}