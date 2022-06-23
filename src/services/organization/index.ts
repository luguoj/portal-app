import {useGatewayClient} from "@/services/useGatewayClient";
import {UserService} from "./UserService";
import {OrganizationService} from "./OrganizationService";
import {CRUDService} from "./CRUDService";

const OrganizationApiClient = useGatewayClient('/organization/api')

export const organizationService = {
    crud: new CRUDService(OrganizationApiClient),
    user: new UserService(OrganizationApiClient),
    organization: new OrganizationService(OrganizationApiClient)
}


