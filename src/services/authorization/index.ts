import {useGatewayClient} from "@/services/useGatewayClient";
import {CRUDService} from "@/services/authorization/CRUDService";
import {UserService} from "@/services/authorization/UserService";

const AuthorizationApiClient = useGatewayClient('/authorization/api')
export const authorizationService = {
    crud: new CRUDService(AuthorizationApiClient),
    user: new UserService(AuthorizationApiClient)
}

