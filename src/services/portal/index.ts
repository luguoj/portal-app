import {useGatewayClient} from "@/services/useGatewayClient";
import {UserService} from "@/services/portal/UserService";
import {CRUDService} from "@/services/portal/CRUDService";

const PortalApiClient = useGatewayClient('/portal/api')

export const portalService = {
    crud: new CRUDService(PortalApiClient),
    user: new UserService(PortalApiClient)
}


