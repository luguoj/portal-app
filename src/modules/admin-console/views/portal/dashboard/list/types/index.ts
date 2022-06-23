import {DashboardTemplateEntity, DashboardTemplateType} from "@/services/portal/types";

if (typeof process.env.VUE_APP_PORTAL_ID !== 'string') {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
export const PORTAL_ID: string = process.env.VUE_APP_PORTAL_ID

export interface NodeData {
    id: string,
    path: string,
    code?: string,
    description?: string,
    enabled?: boolean,
    type?: DashboardTemplateType,
    dashboardTemplate?: DashboardTemplateEntity,
    children: NodeData[]
}