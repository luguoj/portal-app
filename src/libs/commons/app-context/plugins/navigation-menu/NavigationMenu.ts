import {NavigationMenuItem} from "./NavigationMenuItem";
import {NavigationMenuItemRaw} from "./NavigationMenuItemRaw";
import {buildMenuItems} from "./buildMenuItems";
import {ref} from "vue";
import {AppPlugin} from "../../AppPlugin";

export class NavigationMenu extends AppPlugin {
    readonly menuItems = ref<NavigationMenuItem[]>([])

    update(navigaionMenuRaw: NavigationMenuItemRaw[]) {
        this.menuItems.value = buildMenuItems(navigaionMenuRaw)
    }
}