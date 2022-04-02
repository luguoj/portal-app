import {PSRRouteMetaPermission, PSRRouteMetaTag} from "@/libs/commons/router/psr-router-interface";

export interface AppLayoutMeta {
    path: string,
    name: string,
    meta: {
        tag: PSRRouteMetaTag
        permission: PSRRouteMetaPermission | false
    }
}