import {useGatewayClient} from "@/services/useGatewayClient";
import {EntityCRUDService} from "@/modules/psr-entity-crud";

const client = useGatewayClient('/authorization/api')
const DOMAIN_TYPES = {
    USER: 'org.psr.platform.authorization.entity.UserEntity',
}
export const authorizationEntityCRUDService = {
    user: new EntityCRUDService(client, DOMAIN_TYPES.USER)
}

