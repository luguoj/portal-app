import {PSRRouteMetaPermission, PSRRouteMetaTag} from "psr-app-context/route";

export interface AppLayoutRouteRecord {
    path: string,
    name: string,
    meta: {
        tag: PSRRouteMetaTag
        permission?: PSRRouteMetaPermission,
        layout: true
    }
}