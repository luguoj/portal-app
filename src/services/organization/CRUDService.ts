import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {OrganizationEntity, OrganizationHierarchyEntity, OrganizationUseEntity} from "./types";

const DOMAIN_TYPES = {
    ORGANIZATION: 'org.psr.platform.organization.entity.OrganizationEntity',
    ORGANIZATION_USE: 'org.psr.platform.organization.entity.OrganizationUseEntity',
    ORGANIZATION_HIERARCHY: 'org.psr.platform.organization.entity.OrganizationHierarchyEntity'
}

export class CRUDService {
    readonly organization: EntityCRUDService<OrganizationEntity>;
    readonly organizationUse: EntityCRUDService<OrganizationUseEntity>;
    readonly organizationHierarchy: EntityCRUDService<OrganizationHierarchyEntity>;
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
        this.organization = new EntityCRUDService<OrganizationEntity>(this._client, DOMAIN_TYPES.ORGANIZATION)
        this.organizationUse = new EntityCRUDService<OrganizationUseEntity>(this._client, DOMAIN_TYPES.ORGANIZATION_USE)
        this.organizationHierarchy = new EntityCRUDService<OrganizationHierarchyEntity>(this._client, DOMAIN_TYPES.ORGANIZATION_HIERARCHY)
    }
}

