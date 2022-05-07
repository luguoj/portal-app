import {DictionaryEntryEntity, Entity} from "@/libs/services/psr-entity-crud";

export interface GroupEntity extends DictionaryEntryEntity {
    portalId?: string
}

export interface GroupPermissionEntity extends Entity {
    groupId?: string,
    route?: string,
    actions?: string
}

export interface UserGroupEntity extends Entity {
    userId?: string,
    groupId?: string
}

export interface DashboardTemplateEntity extends DictionaryEntryEntity {
    portalId?: string
    content: string
}