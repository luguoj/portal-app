import {routes} from "./route";
import {PsrAppModuleOptions} from "@/libs/commons/psr/app-context/";
import {menus} from "./menus";

export const Dashboard: PsrAppModuleOptions = {
    name: 'dashboard',
    routes,
    menus
}