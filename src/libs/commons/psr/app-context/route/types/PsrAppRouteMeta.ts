import {RouteMeta} from "vue-router";
import {PsrAppRouteMetaTag} from "./PsrAppRouteMetaOptions";

export interface PsrAppRouteMeta extends RouteMeta {
    nameRaw: string
    tag: PsrAppRouteMetaTag
    permissions: string[] | false
}