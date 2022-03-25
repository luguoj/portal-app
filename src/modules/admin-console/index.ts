import {ModuleConfig} from "@/libs/commons/module-config";
import {routes} from "./route";

export const ADMIN_CONSOLE_MODULE_NAME = "admin-console"
export const Admin: ModuleConfig = {
    name: ADMIN_CONSOLE_MODULE_NAME,
    routes
}