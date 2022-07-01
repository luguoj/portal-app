import {RouteRecordRaw} from "vue-router";
import {PsrAppRouteMetaRaw} from "./PsrAppRouteMetaRaw";

export type PsrAppRouteRecordRaw = PsrAppRouteRecordBaseRaw & RouteRecordRaw

interface PsrAppRouteRecordBaseRaw {
    name: string
    path: string
    meta: PsrAppRouteMetaRaw
    children?: PsrAppRouteRecordRaw[]
}