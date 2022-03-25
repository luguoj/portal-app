import {Module} from "vuex";
import {PSRRouteRecordRaw} from "@/libs/commons/router/RouteRecordRaw";

export interface AppConfigModule {
    name: string,
    store?: Module<any, any>,
    routes?: Array<PSRRouteRecordRaw>
}