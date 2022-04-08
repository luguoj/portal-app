import {RouteRecordRaw} from "vue-router";
import {PSRRouteMeta, PSRRouteMetaRaw} from "psr-app-context/route/index";

export type PSRRouteRecord = PSRRouteRecordBase & RouteRecordRaw
export type PSRRouteRecordRaw = PSRRouteRecordBaseRaw & RouteRecordRaw

interface PSRRouteRecordBase {
    name: string
    path: string
    meta: PSRRouteMeta
    children?: PSRRouteRecord[]
}

export interface PSRRouteRecordBaseRaw {
    name: string
    path: string
    meta: PSRRouteMetaRaw
    children?: PSRRouteRecordRaw[]
}