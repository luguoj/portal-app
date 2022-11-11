import {PsrAppModuleOptions} from "@/libs/commons/psr/app-context/";
import {routes} from "./route";
import {menus} from "./menus";

export const ADMIN_CONSOLE_MODULE_NAME = "admin-console"
export const Admin: PsrAppModuleOptions = {
    name: ADMIN_CONSOLE_MODULE_NAME,
    routes,
    menus
}