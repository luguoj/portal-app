export interface PsrMasonryDashboardTemplateRaw {
    lg: PsrMasonryDashboardTemplateItemRaw[]
    md: PsrMasonryDashboardTemplateItemRaw[]
    sm: PsrMasonryDashboardTemplateItemRaw[]
    xs: PsrMasonryDashboardTemplateItemRaw[]
    xxs: PsrMasonryDashboardTemplateItemRaw[]
}

export interface PsrMasonryDashboardTemplateItemRaw {
    x: number,
    y: number,
    w: number,
    h: number,
    widgetName: string
}
