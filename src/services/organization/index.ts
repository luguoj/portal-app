import {useGatewayClient} from "@/services/useGatewayClient";
import {UserService} from "./UserService";
import {OrganizationService} from "@/services/organization/OrganizationService";

const OrganizationApiClient = useGatewayClient('/organization/api')

export const organizationService = {
    user: new UserService(OrganizationApiClient),
    organization: new OrganizationService(OrganizationApiClient)
}


