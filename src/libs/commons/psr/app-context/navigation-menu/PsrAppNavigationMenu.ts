import {PsrAppNavigationMenuItem, PsrAppNavigationMenuItems} from "./types/PsrAppNavigationMenuItem";
import {computed, reactive, ref} from "vue";
import {filterFromBottom, filterFromRoot} from "@/libs/commons/psr/utils/array-tree";
import {PsrAppNavigationLayoutItem} from "./types/PsrAppNavigationLayoutItem";

export class PsrAppNavigationMenu {
    readonly layoutItemsRaw: PsrAppNavigationLayoutItem[]
    readonly menuItemsRaw: Record<string, PsrAppNavigationMenuItems>
    readonly layoutItems = ref<PsrAppNavigationLayoutItem[]>([])
    readonly menuItems = reactive<Record<string | symbol, PsrAppNavigationMenuItems>>({})
    readonly currentLayoutName = ref<string>('')
    readonly currentLayoutMenuItems = computed<PsrAppNavigationMenuItems>(() => this.menuItems[this.currentLayoutName.value])

    constructor(options: {
        layoutItemsRaw: PsrAppNavigationLayoutItem[],
        menuItemsRaw: Record<string, PsrAppNavigationMenuItems>
    }) {
        this.layoutItemsRaw = options.layoutItemsRaw
        this.menuItemsRaw = options.menuItemsRaw
        this.doFilter(() => false, () => false)
    }

    doFilter(
        filterLayoutItemFn: (node: PsrAppNavigationLayoutItem) => boolean,
        filterMenuItemFn: (node: PsrAppNavigationMenuItem) => boolean
    ) {
        this.layoutItems.value = this.layoutItemsRaw.filter(item => {
            return !item.permissions || filterLayoutItemFn(item)
        })
        for (const layoutName in this.menuItemsRaw) {
            this.menuItems[layoutName] = {}
            for (const menuUsage in this.menuItemsRaw[layoutName]) {
                const filteredMenu = filterFromRoot(this.menuItemsRaw[layoutName][menuUsage], item => {
                    return !item.permissions || filterMenuItemFn(item)
                })
                this.menuItems[layoutName][menuUsage] = filterFromBottom(
                    filteredMenu,
                    item => {
                        return !!item.route || item.children?.length > 0
                    }
                )
            }
        }
    }
}
