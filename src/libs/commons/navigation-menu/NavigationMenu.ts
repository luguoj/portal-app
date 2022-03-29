import {NavigationMenuItem} from "./NavigationMenuItem";
import {NavigationMenuItemRaw} from "./NavigationMenuItemRaw";
import {buildMenuItems} from "./buildMenuItems";
import {App} from "vue";

export class NavigationMenu {
    menuItems: NavigationMenuItem[]
    _injectKey: string

    constructor(menuItems: NavigationMenuItemRaw[], injectKey: string) {
        this.menuItems = buildMenuItems(menuItems)
        this._injectKey = injectKey
    }

    install(app: App) {
        app.provide(this._injectKey, this)
    }
}