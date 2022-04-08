import {RouteMeta} from "vue-router";

export interface PSRRouteMeta extends RouteMeta {
    tag: PSRRouteMetaTag
    permission?: PSRRouteMetaPermission
}

export interface PSRRouteMetaRaw extends RouteMeta {
    tag: PSRRouteMetaTag
    permission?: string[]
}

export interface PSRRouteMetaTag {
    title: string
    iconCls?: string
    isAffix?: boolean
}

export interface PSRRouteMetaPermission {
    key: string,
    permissions?: string[]
}

