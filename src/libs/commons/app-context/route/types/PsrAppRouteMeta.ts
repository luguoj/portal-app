import {RouteMeta} from "vue-router";
import {PsrAppRouteMetaPermission, PsrAppRouteMetaTag} from "./PsrAppRouteMetaOptions";

export interface PsrAppRouteMeta extends RouteMeta {
    tag: PsrAppRouteMetaTag
    permission?: PsrAppRouteMetaPermission
}