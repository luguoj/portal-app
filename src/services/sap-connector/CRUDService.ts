import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {JcoDestinationEntity} from "./types";

const DOMAIN_TYPES = {
    JCO_DESTINATION: 'org.psr.platform.connector.sap.entity.JcoDestinationEntity'
}

export class CRUDService {
    readonly jcoDestination: EntityCRUDService<JcoDestinationEntity>;
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
        this.jcoDestination = new EntityCRUDService<JcoDestinationEntity>(this._client, DOMAIN_TYPES.JCO_DESTINATION)
    }
}

