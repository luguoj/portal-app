import {PsrAppRouteRecord} from "./PsrAppRouteRecord";
import {RouteLocationNormalizedLoaded} from "vue-router";

export interface PsrAppRouteStatus {
    layout: PsrAppRouteRecord | null
    module: PsrAppRouteRecord | null
    route: RouteLocationNormalizedLoaded
}

export interface PsrAppRouteChangeEvent {
    oldRoute: PsrAppRouteStatus,
    newRoute: PsrAppRouteStatus
}