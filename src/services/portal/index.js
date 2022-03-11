import {useGatewayClient} from "@/services/useGatewayClient";
import {EntityCRUDService} from "@/modules/psr-entity-crud";

const client = useGatewayClient({contextPath: '/portal/api'})

export const portalEntityCRUDService = {
    group: new EntityCRUDService(client, 'org.psr.platform.portal.entity.GroupEntity'),
}

export const userService = {
    findRoutePermissionByPortalId: (portalId) => {
        return client.get('/user/route_permission', {params: {portalId: portalId}})
            .then((resp) => {
                if (resp && resp.data) {
                    return resp.data
                }
                return []
            })
    }
}

