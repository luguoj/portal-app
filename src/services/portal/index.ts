import {useGatewayClient} from "@/services/useGatewayClient";
import {AxiosInstance} from "axios";
import {EntityCRUDService} from "@/modules/psr-entity-crud";

const PortalApiClient = useGatewayClient('/portal/api')

class UserService {
    private readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client
    }

    findPermissionByPortalId(portalId: string): Promise<Record<string, string[]>> {
        return this._client.get('/user/permission', {params: {portalId: portalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}

const DOMAIN_TYPES = {
    GROUP: 'org.psr.platform.portal.entity.GroupEntity',
    GROUP_PERMISSION: 'org.psr.platform.portal.entity.GroupPermissionEntity',
    USER_GROUP: 'org.psr.platform.portal.entity.UserGroupEntity'
}

export const portalEntityCRUDService = {
    group: new EntityCRUDService(PortalApiClient, DOMAIN_TYPES.GROUP),
    groupPermission: new EntityCRUDService(PortalApiClient, DOMAIN_TYPES.GROUP_PERMISSION),
    userGroup: new EntityCRUDService(PortalApiClient, DOMAIN_TYPES.USER_GROUP)
}
export const userService = new UserService(PortalApiClient)


