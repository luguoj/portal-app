import {AppModuleConfig} from "psr-app-context/";
import {routes} from "./route";
import {menus} from "./menus";

export const SamplePage: AppModuleConfig = {
    name: "sample-page",
    routes,
    menus
}