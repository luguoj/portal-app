import {AppRouteCache} from "./AppRouteCache";
import {usePlugin} from "../../usePlugin";

const KEY = 'psr-app-context-route-cache'

export function useAppRouteCache() {
    return usePlugin<AppRouteCache>(KEY)
}

export function createAppRouteCache() {
    return new AppRouteCache(KEY);
}