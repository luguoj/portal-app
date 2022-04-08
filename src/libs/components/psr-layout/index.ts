import {store} from "@/libs/components/psr-layout/store";
import {AppLayoutConfig} from "@/libs/commons/app-context/layout/AppLayoutConfig";
import {routes} from "@/libs/components/psr-layout/route";
import {menus} from "./menus"

export const PsrLayout: AppLayoutConfig = {
    modules: [],
    name: 'psr-layout',
    store,
    component: () => import("./views/PsrLayout.vue"),
    routes,
    iconCls: "pi pi-home",
    title: "布局",
    menus
}