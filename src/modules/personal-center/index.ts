import {PsrAppModuleOptions} from "@/libs/commons/psr/app-context/";
import {routes} from "./route";
import {menus} from "./menus";

export const PersonalCenter: PsrAppModuleOptions = {
    name: "personal-center",
    routes,
    menus
}