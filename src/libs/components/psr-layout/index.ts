import {store} from "@/libs/components/psr-layout/store";
import {routes} from "@/libs/components/psr-layout/route";
import {ModuleConfig} from "@/libs/commons/module-config";
import {menus} from "@/libs/components/psr-layout/menus";

export const PSR_LAYOUT_MODULE_NAME = 'psr-layout'
export const PsrLayout: ModuleConfig = {
    name: PSR_LAYOUT_MODULE_NAME,
    store,
    routes,
    menus
}