import {useGatewayClient} from "@/services/useGatewayClient";
import {EntityCRUDService} from "@/modules/psr-entity-crud";

const client = useGatewayClient({contextPath: '/authorization/api'})

export const authorizationEntityCRUDService = {
    user: new EntityCRUDService(client, 'org.psr.platform.authorization.entity.UserEntity')
}

