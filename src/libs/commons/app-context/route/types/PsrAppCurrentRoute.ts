import {PsrAppRouteRecord} from "./PsrAppRouteRecord";
import {RouteLocationNormalizedLoaded} from "vue-router";

export interface PsrAppCurrentRoute {
    layout: PsrAppRouteRecord | null
    module: PsrAppRouteRecord | null
    route: RouteLocationNormalizedLoaded | null
}