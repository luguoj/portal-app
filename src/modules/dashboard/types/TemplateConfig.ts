import {Widget} from "./Widget";

export type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
export const breakpointKeys: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs']
export const breakpointWidth = {lg: 1200, md: 992, sm: 768, xs: 480, xxs: 0}
export const breakpointCol = {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}

export interface BreakpointSelection {
    title: string,
    breakpoint: BreakpointKey,
}

export const breakpointSelections: BreakpointSelection[] = [{
    title: '大屏 > 1200px',
    breakpoint: 'lg',
}, {
    title: '中屏 992px ~ 1200px',
    breakpoint: 'md',
}, {
    title: '小屏 678px ~ 992px',
    breakpoint: 'sm',
}, {
    title: '超小屏 480px ~ 678px',
    breakpoint: 'xs',
}, {
    title: '特小屏 0 ~ 480px',
    breakpoint: 'xxs',
}]

export interface TemplateConfigRaw {
    lg: TemplateConfigItemRaw[]
    md?: TemplateConfigItemRaw[]
    sm?: TemplateConfigItemRaw[]
    xs?: TemplateConfigItemRaw[]
    xxs?: TemplateConfigItemRaw[]
}

export interface TemplateConfigItemRaw {
    x: number,
    y: number,
    w: number,
    h: number,
    widget: Widget
}

export interface TemplateConfig {
    lg: TemplateConfigItem[]
    md: TemplateConfigItem[]
    sm: TemplateConfigItem[]
    xs: TemplateConfigItem[]
    xxs: TemplateConfigItem[]
}

export const BlankTemplateConfig: TemplateConfig = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: []
}

export interface TemplateConfigItem {
    i: string,
    x: number,
    y: number,
    w: number,
    h: number,
    widget: Widget
}