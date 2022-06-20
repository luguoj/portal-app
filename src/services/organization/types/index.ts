import {Entity} from "@/libs/services/psr-entity-crud";

export interface UserPersonnelEntity extends Entity {
    firstName?: string
    lastName?: string
    resume?: string
}