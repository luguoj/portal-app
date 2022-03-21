import {useGatewayClient} from "@/services/useGatewayClient";
import {EntityCRUDService} from "@/modules/psr-entity-crud";

const client = useGatewayClient({contextPath: '/portal/api'})

export const portalEntityCRUDService = {
    group: new EntityCRUDService(client, 'org.psr.platform.portal.entity.GroupEntity'),
    groupPermission: new EntityCRUDService(client, 'org.psr.platform.portal.entity.GroupPermissionEntity'),
    userGroup: new EntityCRUDService(client, 'org.psr.platform.portal.entity.UserGroupEntity')
}

export const userService = {
    findPermissionByPortalId: (portalId) => {
        return client.get('/user/permission', {params: {portalId: portalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}

