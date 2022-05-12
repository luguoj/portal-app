import {DashboardTemplateType} from "../types";

export interface DashboardTemplateTypeEntry {
    type: DashboardTemplateType,
    title: string
}

const DashboardTemplateTypes = new Map<DashboardTemplateType, DashboardTemplateTypeEntry>()
DashboardTemplateTypes.set('masonry', {type: 'masonry', title: '瀑布流'})
DashboardTemplateTypes.set('big-screen', {type: 'big-screen', title: '大屏'})
export default DashboardTemplateTypes