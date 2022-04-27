import {PsrAppRouteRecord} from "./PsrAppRouteRecord";
import {RouteLocationMatched, RouteLocationNormalizedLoaded} from "vue-router";

export interface PsrAppRouteStatus {
    layout: PsrAppRouteRecord & RouteLocationMatched | null
    module: PsrAppRouteRecord & RouteLocationMatched | null
    route: RouteLocationNormalizedLoaded
}

export interface PsrAppRouteChangeEvent {
    oldRoute: PsrAppRouteStatus,
    newRoute: PsrAppRouteStatus
}