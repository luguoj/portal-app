import {useGatewayClient} from "@/services/useGatewayClient";
import {UserService} from "@/services/portal/UserService";
import {CRUDService} from "@/services/portal/CRUDService";
import {GroupService} from "@/services/portal/GroupService";

const PortalApiClient = useGatewayClient('/portal/api')

export const portalService = {
    crud: new CRUDService(PortalApiClient),
    user: new UserService(PortalApiClient),
    group: new GroupService(PortalApiClient)
}


