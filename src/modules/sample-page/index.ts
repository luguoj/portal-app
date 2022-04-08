import {PsrAppModuleOptions} from "@/libs/commons/app-context/";
import {routes} from "./route";
import {menus} from "./menus";

export const SamplePage: PsrAppModuleOptions = {
    name: "sample-page",
    routes,
    menus
}