import {PSRRouteMetaTag} from "psr-app-context/route";

export interface AppRouteCacheItem {
    name: string | symbol,
    componentName: string,
    tag: PSRRouteMetaTag,
    path: string
}
