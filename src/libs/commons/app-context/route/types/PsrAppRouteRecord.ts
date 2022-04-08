import {RouteRecordRaw} from "vue-router";
import {PsrAppRouteMeta} from "./PsrAppRouteMeta";

export type PsrAppRouteRecord = PsrAppRouteRecordBase & RouteRecordRaw

interface PsrAppRouteRecordBase {
    name: string
    path: string
    meta: PsrAppRouteMeta
    children?: PsrAppRouteRecord[]
}
