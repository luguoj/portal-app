import {PsrAppNavigationMenuItem} from "./types/PsrAppNavigationMenuItem";
import {computed, ref, shallowReactive} from "vue";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";

export class PsrAppNavigationMenu {
    readonly menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]> = {}
    readonly menuItems = shallowReactive<Record<string | symbol, PsrAppNavigationMenuItem[]>>({})
    readonly currentLayoutName = ref<string>('')
    readonly currentLayoutMenuItems = computed(() => this.menuItems[this.currentLayoutName.value])

    constructor(menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]>) {
        this.menuItemsRaw = menuItemsRaw
    }

    doFilter(filterFn: (node: PsrAppNavigationMenuItem) => boolean) {
        for (const layoutName in this.menuItemsRaw) {
            this.menuItems[layoutName] = filterFromBottom(this.menuItemsRaw[layoutName], filterFn)
        }
    }
}
