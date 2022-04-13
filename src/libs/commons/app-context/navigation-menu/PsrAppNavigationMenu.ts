import {PsrAppNavigationMenuItem} from "./types/PsrAppNavigationMenuItem";
import {computed, ref, shallowReactive} from "vue";
import {filterFromBottom} from "@/libs/commons/utils/array-tree";
import {PsrAppNavigationLayoutItem} from "./types/PsrAppNavigationLayoutItem";

export class PsrAppNavigationMenu {
    readonly layoutItemsRaw: PsrAppNavigationLayoutItem[]
    readonly menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]>
    readonly layoutItems = ref<PsrAppNavigationLayoutItem[]>([])
    readonly menuItems = shallowReactive<Record<string | symbol, PsrAppNavigationMenuItem[]>>({})
    readonly currentLayoutName = ref<string>('')
    readonly currentLayoutMenuItems = computed(() => this.menuItems[this.currentLayoutName.value])

    constructor(options: { layoutItemsRaw: PsrAppNavigationLayoutItem[], menuItemsRaw: Record<string, PsrAppNavigationMenuItem[]> }) {
        this.layoutItemsRaw = options.layoutItemsRaw
        this.menuItemsRaw = options.menuItemsRaw
    }

    doFilter(
        filterLayoutItemFn: (node: PsrAppNavigationLayoutItem) => boolean,
        filterMenuItemFn: (node: PsrAppNavigationMenuItem) => boolean
    ) {
        this.layoutItems.value = this.layoutItemsRaw.filter(filterLayoutItemFn)
        for (const layoutName in this.menuItemsRaw) {
            this.menuItems[layoutName] = filterFromBottom(this.menuItemsRaw[layoutName], filterMenuItemFn)
        }
    }
}
