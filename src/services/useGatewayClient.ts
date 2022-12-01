import {platformClient} from "@/config/psr-app-context/platformClient";

export function useGatewayClient(contextPath: string) {
    return platformClient.createApiClient(contextPath)
}