import {useGatewayClient} from "@/services/useGatewayClient";
import {CRUDService} from "@/services/authorization/CRUDService";

const PortalApiClient = useGatewayClient('/authorization/api')
export const authorizationService = {
    crud: new CRUDService(PortalApiClient)
}

