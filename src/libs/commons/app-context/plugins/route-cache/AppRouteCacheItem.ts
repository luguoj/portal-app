import {PSRRouteMetaTag} from "@/libs/commons/router/psr-router-interface";

export interface AppRouteCacheItem {
    name: string | symbol,
    componentName: string,
    tag: PSRRouteMetaTag,
    path: string
}
