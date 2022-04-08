import {PsrAppNavigationMenuItem} from "./types/PsrAppNavigationMenuItem";
import {ref, shallowReactive} from "vue";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";
import {PsrAppRouteRecord} from "../route";

export class PsrAppNavigationMenu {
    readonly menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]> = {}
    readonly menuItems = shallowReactive<Record<string | symbol, PsrAppNavigationMenuItem[]>>({})
    readonly currentLayoutMenuItems = ref<PsrAppNavigationMenuItem[]>([])

    constructor(menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]>) {
        this.menuItemsRaw = menuItemsRaw
    }

    doFilter(filterFn: (node: PsrAppNavigationMenuItem) => boolean) {
        for (const layoutName in this.menuItemsRaw) {
            this.menuItems[layoutName] = filterFromBottom(this.menuItemsRaw[layoutName], filterFn)
        }
    }

    updateLayout(layout: PsrAppRouteRecord) {
        this.currentLayoutMenuItems.value = this.menuItems[layout.name]
    }
}
