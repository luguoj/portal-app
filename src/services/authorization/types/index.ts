import {Entity} from "@/libs/services/psr-entity-crud";

export interface UserEntity extends Entity {
    enabled?: boolean,
    accountExpiryTime?: string
    accountLockExpiryTime?: string
    passwordExpiryTime?: string
}