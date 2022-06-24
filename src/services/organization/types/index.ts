import {DictionaryEntryEntity, Entity} from "@/libs/services/psr-entity-crud";

export interface OrganizationEntity extends DictionaryEntryEntity {
    useId?: string
    rootId?: string
    parentId?: string
    left?: number
    right?: number
    hierarchyId?: string
}

export interface OrganizationUseEntity extends Entity {
    description?: string
}

export interface OrganizationHierarchyEntity extends DictionaryEntryEntity {
    useId?: string
}

export interface UserPersonnelEntity extends Entity {
    firstName?: string
    lastName?: string
    resume?: string
}

export interface OrganizationCreationDTO {
    id?: string,
    useId: string,
    code: string
    description: string
    enabled?: boolean
    hierarchyId?: string
    parentId?: string
}

export interface OrganizationPatchDTO {
    code?: string
    description?: string
    enabled?: boolean
    hierarchyId?: string
    parentId?: string
}