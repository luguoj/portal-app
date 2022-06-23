import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {OrganizationEntity} from "./types";

const DOMAIN_TYPES = {
    ORGANIZATION: 'org.psr.platform.organization.entity.OrganizationEntity',
}

export class CRUDService {
    readonly organization: EntityCRUDService<OrganizationEntity>;
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
        this.organization = new EntityCRUDService<OrganizationEntity>(this._client, DOMAIN_TYPES.ORGANIZATION)
    }
}

