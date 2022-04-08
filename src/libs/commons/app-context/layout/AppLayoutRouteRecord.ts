import {PSRRouteMetaPermission, PSRRouteMetaTag} from "@/libs/commons/app-context/route";

export interface AppLayoutRouteRecord {
    path: string,
    name: string,
    meta: {
        tag: PSRRouteMetaTag
        permission?: PSRRouteMetaPermission,
        layout: true
    }
}