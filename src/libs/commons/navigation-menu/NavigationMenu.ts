import {NavigationMenuItem} from "./NavigationMenuItem";
import {NavigationMenuItemRaw} from "./NavigationMenuItemRaw";
import {buildMenuItems} from "./buildMenuItems";
import {App, ref} from "vue";
import {AppContext, AppPlugin} from "@/libs/commons/app-context";
import {filterByPermission} from "./filterByPermission";

export class NavigationMenu implements AppPlugin {
    injectKey: string
    readonly allMenuItems: NavigationMenuItem[]
    readonly menuItems = ref<NavigationMenuItem[]>([])

    constructor(injectKey: string, menuItems: NavigationMenuItemRaw[]) {
        this.allMenuItems = buildMenuItems(menuItems)
        this.injectKey = injectKey
    }

    install(app: App, appContext: AppContext) {
        app.provide(this.injectKey, this)
        filterByPermission(this, appContext)
    }
}