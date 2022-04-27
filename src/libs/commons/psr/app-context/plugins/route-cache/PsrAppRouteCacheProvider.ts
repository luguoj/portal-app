import {PsrAppRouteCache} from "./PsrAppRouteCache";
import {usePlugin} from "../../usePlugin";

const KEY = 'psr-app-context-route-cache'

export function useAppRouteCache() {
    return usePlugin<PsrAppRouteCache>(KEY)
}

export function createAppRouteCache() {
    return new PsrAppRouteCache(KEY);
}