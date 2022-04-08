import {PsrAppRouteMetaTag} from "@/libs/commons/app-context/route";

export interface PsrAppRouteCacheItem {
    name: string | symbol,
    componentName: string,
    tag: PsrAppRouteMetaTag,
    path: string
}
