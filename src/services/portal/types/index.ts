import {DictionaryEntryEntity} from "@/libs/services/psr-entity-crud";

export type DashboardTemplateType = 'masonry' | 'big-screen'

export interface DashboardTemplateEntity extends DictionaryEntryEntity {
    portalId?: string
    type?: DashboardTemplateType
    content?: string
}