import {Entity} from "@/libs/services/psr-entity-crud";

export interface JcoDestinationEntity extends Entity {
    description?: string,
    enabled?: boolean,
    mshost?: string,
    sgroup?: string,
    ashost?: string,
    r3name?: string,
    sysnr?: string,
    username?: string,
    password?: string,
    client?: string,
    lang?: string
}