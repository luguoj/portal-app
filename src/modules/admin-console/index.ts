import {AppModuleConfig} from "@/libs/commons/app-context/";
import {routes} from "./route";
import {menus} from "@/modules/admin-console/menus";

export const ADMIN_CONSOLE_MODULE_NAME = "admin-console"
export const Admin: AppModuleConfig = {
    name: ADMIN_CONSOLE_MODULE_NAME,
    routes,
    menus
}