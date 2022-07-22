import {useGatewayClient} from "@/services/useGatewayClient";
import {CRUDService} from "@/services/portal/CRUDService";

const SapConnectorApiClient = useGatewayClient('/sap-connector/api')

export const sapConnectorService = {
    crud: new CRUDService(SapConnectorApiClient)
}


