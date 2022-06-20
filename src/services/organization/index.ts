import {useGatewayClient} from "@/services/useGatewayClient";
import {UserService} from "./UserService";

const OrganizationApiClient = useGatewayClient('/organization/api')

export const organizationService = {
    user: new UserService(OrganizationApiClient),
}


