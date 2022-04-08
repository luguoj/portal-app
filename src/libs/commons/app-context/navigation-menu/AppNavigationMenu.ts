import {AppNavigationMenuItem} from "./AppNavigationMenuItem";
import {ref, shallowReactive} from "vue";
import {AppLayoutRouteRecord} from "../layout/AppLayoutRouteRecord";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";

export class AppNavigationMenu {
    readonly menuItemsRaw: Record<string, AppNavigationMenuItem[]> = {}
    readonly menuItems = shallowReactive<Record<string | symbol, AppNavigationMenuItem[]>>({})
    readonly currentLayoutMenuItems = ref<AppNavigationMenuItem[]>([])

    constructor(menuItemsRaw: Record<string, AppNavigationMenuItem[]>) {
        this.menuItemsRaw = menuItemsRaw
    }

    doFilter(filterFn: (node: AppNavigationMenuItem) => boolean) {
        for (const layoutName in this.menuItemsRaw) {
            this.menuItems[layoutName] = filterFromBottom(this.menuItemsRaw[layoutName], filterFn)
        }
    }

    updateLayout(layout: AppLayoutRouteRecord) {
        this.currentLayoutMenuItems.value = this.menuItems[layout.name]
    }
}
