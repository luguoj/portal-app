import {RouteComponent, RouteLocationNormalized} from "vue-router";
import {PSRRouteMeta} from "@/libs/commons/router/psr-router-interface/index";


export type PSRRouteRecordRaw = PSRRouteRecordNestSingleView | PSRRouteRecordNestMultipleView

type Lazy<T> = () => Promise<T>;
type _RouteRecordProps = boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>);

export interface PSRRouteRecordBase {
    name: string
    path: string
    meta?: PSRRouteMeta
    children?: PSRRouteRecordRaw[]
}

export interface PSRRouteRecordNestSingleView extends PSRRouteRecordBase {
    component: RouteComponent | Lazy<RouteComponent>
    components?: never
    props?: _RouteRecordProps;
}

export interface PSRRouteRecordNestMultipleView extends PSRRouteRecordBase {
    component?: never
    components: Record<string, RouteComponent | Lazy<RouteComponent>>
    props?: Record<string, _RouteRecordProps> | boolean;
}