import {EntityCRUDService} from "@/libs/services/psr-entity-crud";
import {AxiosInstance} from "axios";
import {DashboardTemplateEntity, GroupEntity, GroupPermissionEntity, UserGroupEntity} from "@/services/portal/types";

const DOMAIN_TYPES = {
    GROUP: 'org.psr.platform.portal.entity.GroupEntity',
    GROUP_PERMISSION: 'org.psr.platform.portal.entity.GroupPermissionEntity',
    USER_GROUP: 'org.psr.platform.portal.entity.UserGroupEntity',
    DASHBOARD_TEMPLATE: 'org.psr.platform.portal.entity.DashboardTemplateEntity'
}

export class CRUDService {
    private readonly _client: AxiosInstance;
    readonly group: EntityCRUDService<GroupEntity>;
    readonly groupPermission: EntityCRUDService<GroupPermissionEntity>;
    readonly userGroup: EntityCRUDService<UserGroupEntity>;
    readonly dashboardTemplate: EntityCRUDService<DashboardTemplateEntity>;

    constructor(client: AxiosInstance) {
        this._client = client
        this.group = new EntityCRUDService<GroupEntity>(this._client, DOMAIN_TYPES.GROUP)
        this.groupPermission = new EntityCRUDService<GroupPermissionEntity>(this._client, DOMAIN_TYPES.GROUP_PERMISSION)
        this.userGroup = new EntityCRUDService<UserGroupEntity>(this._client, DOMAIN_TYPES.USER_GROUP)
        this.dashboardTemplate = new EntityCRUDService<DashboardTemplateEntity>(this._client, DOMAIN_TYPES.DASHBOARD_TEMPLATE)
    }
}

