import {RouteMeta} from "vue-router";
import {PsrAppRouteMetaTag} from "./PsrAppRouteMetaOptions";

export interface PsrAppRouteMetaRaw extends RouteMeta {
    tag: PsrAppRouteMetaTag
    permissions: string[] | false
}
