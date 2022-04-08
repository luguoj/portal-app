import {store} from "@/libs/components/psr-layout/store";
import {PsrAppLayoutOptions} from "@/libs/commons/app-context/types/PsrAppLayoutOptions";
import {routes} from "@/libs/components/psr-layout/route";
import {menus} from "./menus"

export const PsrLayout: PsrAppLayoutOptions = {
    modules: [],
    name: 'psr-layout',
    store,
    component: () => import("./views/PsrLayout.vue"),
    routes,
    iconCls: "pi pi-home",
    title: "布局",
    menus
}