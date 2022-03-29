import {inject, provide} from "vue";
import {RouteCache} from "./RouteCache";
import {useRouter} from "vue-router";

const CACHED_ROUTES_KEY = 'psr-route-cache'

export function provideRouteCache() {
    provide(CACHED_ROUTES_KEY, createRouteCache())
}

export function useRouteCache() {
    return inject(CACHED_ROUTES_KEY) as RouteCache
}

export function createRouteCache() {
    return new RouteCache(useRouter());
}