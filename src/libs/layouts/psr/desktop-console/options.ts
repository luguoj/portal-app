import {PsrAppLayoutOptions} from "@/libs/commons/psr/app-context/types/PsrAppLayoutOptions";
import {store} from "./store";
import {routes} from "./route";

export const PsrLayoutDesktopConsoleOptions: PsrAppLayoutOptions = {
    modules: [],
    name: 'psr-layout-desktop-console',
    store,
    component: () => import("./index.vue"),
    routes,
    iconCls: "pi pi-home",
    title: "桌面控制台"
}