import {PsrAppLayoutOptions} from "@/libs/commons/app-context/types/PsrAppLayoutOptions";
import {store} from "./store";
import {routes} from "./route";
import {menus} from "./menus"

export const PsrLayoutDesktopConsole: PsrAppLayoutOptions = {
    modules: [],
    name: 'psr-layout-desktop-console',
    store,
    component: () => import("./views/PsrLayoutDesktopConsole.vue"),
    routes,
    iconCls: "pi pi-home",
    title: "桌面控制台",
    menus
}