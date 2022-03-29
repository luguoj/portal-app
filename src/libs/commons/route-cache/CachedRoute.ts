import {PSRRouteMetaTag} from "@/libs/commons/router/psr-router-interface";

export interface CachedRoute {
    name: string | symbol,
    componentName: string,
    tag: PSRRouteMetaTag,
    path: string
}
