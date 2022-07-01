import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {UserEntity} from "@/services/authorization/types";

const DOMAIN_TYPES = {
    USER: 'org.psr.platform.authorization.entity.UserEntity',
}


export class CRUDService {
    private readonly _client: AxiosInstance;
    readonly user: EntityCRUDService<UserEntity>;

    constructor(client: AxiosInstance) {
        this._client = client
        this.user = new EntityCRUDService<UserEntity>(this._client, DOMAIN_TYPES.USER)
    }
}

