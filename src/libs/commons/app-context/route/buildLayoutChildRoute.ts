// 构建布局子路由，路由名称增加布局名前缀
import {PsrAppRouteRecord} from "./types/PsrAppRouteRecord";
import {PsrAppRouteRecordRaw} from "./types/PsrAppRouteRecordRaw";

export function buildLayoutChildRoute(routeRecordRaw: PsrAppRouteRecordRaw, layoutName: string, basePath?: string): PsrAppRouteRecord {
    if (basePath == undefined) {
        basePath = `/${layoutName}`
    }
    const name = `${layoutName}/${routeRecordRaw.name}`
    const path = `${basePath}/${routeRecordRaw.path}`
    const meta = {
        ...routeRecordRaw.meta,
        permission: routeRecordRaw.meta?.permission ? {
            key: routeRecordRaw.name,
            permissions: routeRecordRaw.meta.permission
        } : undefined
    }
    let children: PsrAppRouteRecord[] | undefined
    if (routeRecordRaw.children) {
        children = []
        for (let i = 0; i < routeRecordRaw.children.length; i++) {
            const child = routeRecordRaw.children[i];
            children.push(buildLayoutChildRoute(child, layoutName, path))
        }
    }
    return {...routeRecordRaw, name, path, meta, children}
}