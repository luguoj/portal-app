import {Component} from "vue";

export type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
export const BREAKPOINT_KEYS: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs']
export const widthByBreakpoint = {lg: 1200, md: 992, sm: 768, xs: 480, xxs: 0}
export const colNumByBreakpoint = {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}

export interface LayoutOptions {
    lg: ItemOptions[]
    md: ItemOptions[]
    sm: ItemOptions[]
    xs: ItemOptions[]
    xxs: ItemOptions[]
}

export function BlankLayoutOptions(): LayoutOptions {
    return {
        lg: [],
        md: [],
        sm: [],
        xs: [],
        xxs: []
    }
}

export interface ItemOptions {
    i: string,
    x: number,
    y: number,
    w: number,
    h: number,
    name: string,
    title: string,
    component: Component
    dataProvider?: string
    dataTransform?: string
}

export interface DataSupplierRaw {
    name: string,
    supplier: () => Promise<any>
    timeout?: number
}