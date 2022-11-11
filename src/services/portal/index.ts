import {useGatewayClient} from "@/services/useGatewayClient";
import {CRUDService} from "@/services/portal/CRUDService";
import {DashboardTemplateService} from "@/services/portal/DashboardTemplateService";

const PortalApiClient = useGatewayClient('/portal/api')

export const portalService = {
    crud: new CRUDService(PortalApiClient),
    dashboardTemplate: new DashboardTemplateService(PortalApiClient)
}


