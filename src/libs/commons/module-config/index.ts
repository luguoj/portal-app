import {Module} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router";

export interface ModuleConfig {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>
}