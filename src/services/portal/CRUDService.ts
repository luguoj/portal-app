import {DictionaryEntryEntity, Entity, EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";

const DOMAIN_TYPES = {
    GROUP: 'org.psr.platform.portal.entity.GroupEntity',
    GROUP_PERMISSION: 'org.psr.platform.portal.entity.GroupPermissionEntity',
    USER_GROUP: 'org.psr.platform.portal.entity.UserGroupEntity'
}

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

export class CRUDService {
    private readonly _client: AxiosInstance;
    readonly group: EntityCRUDService<GroupEntity>;
    readonly groupPermission: EntityCRUDService<GroupPermissionEntity>;
    readonly userGroup: EntityCRUDService<UserGroupEntity>;

    constructor(client: AxiosInstance) {
        this._client = client
        this.group = new EntityCRUDService<GroupEntity>(this._client, DOMAIN_TYPES.GROUP)
        this.groupPermission = new EntityCRUDService<GroupPermissionEntity>(this._client, DOMAIN_TYPES.GROUP_PERMISSION)
        this.userGroup = new EntityCRUDService(this._client, DOMAIN_TYPES.USER_GROUP)
    }
}

