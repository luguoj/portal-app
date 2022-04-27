import {PsrAppRouteMetaTag} from "@/libs/commons/psr/app-context/route";

export interface PsrAppRouteCacheItem {
    name: string | symbol,
    componentName: string,
    tag: PsrAppRouteMetaTag,
    path: string
}
