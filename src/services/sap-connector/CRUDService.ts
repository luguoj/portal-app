import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {GroupEntity} from "@/services/portal/types";
import {JcoDestinationEntity} from "./types";

const DOMAIN_TYPES = {
    JCO_DESTINATION: 'org.psr.platform.connector.sap.entity.JcoDestinationEntity'
}

export class CRUDService {
    readonly jcoDestination: EntityCRUDService<JcoDestinationEntity>;
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
        this.jcoDestination = new EntityCRUDService<GroupEntity>(this._client, DOMAIN_TYPES.JCO_DESTINATION)
    }
}

